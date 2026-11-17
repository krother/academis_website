"""
Word Pizza: a classroom game where participants build a circle of concepts.

All data is kept in memory. Integrate into the FastAPI app with:

    from word_pizza import router as word_pizza_router
    app.include_router(word_pizza_router)
"""
import threading
from datetime import datetime, timedelta
from typing import Literal

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

MIN_WORDS = 3  # number of words a game starts with
LIMIT_WORDS = 24  # upper bound for max_words
DEFAULT_MAX_WORDS = 16
START_LIVES = 3
MAX_WORD_LENGTH = 20
MAX_AGE = timedelta(hours=24)
GUESS_SECONDS = 30
DRAW_SECONDS = 60  # a drawing player who takes longer loses the role
DEFAULT_WORDS = ["data", "programming", "statistics"]

router = APIRouter(prefix="/word_pie", tags=["word_pie"])


class GameState(BaseModel):
    name: Literal["wait", "draw", "guess", "won", "game_over"] = "wait"
    secret_position: int | None = None  # gap index: new word is inserted before words[i]
    secret_word: str | None = None
    started_at: datetime = Field(default_factory=datetime.now)
    draw_started_at: datetime | None = None  # start of the DRAW phase
    word_submitted_at: datetime | None = None  # start of the GUESS phase


class Game(BaseModel):
    id: str
    state: GameState = Field(default_factory=GameState)
    lives: int = START_LIVES
    words: dict[int, str]
    votes: dict[int, int] = Field(default_factory=dict)  # gap -> votes, shown after a round
    last_position: int | None = None  # gap of the last round, shown after a round
    max_words: int = DEFAULT_MAX_WORDS  # the pizza is won with this many slices
    seconds_left: int | None = None  # remaining time of the DRAW or GUESS phase
    message: str = ""


GAMES: dict[str, Game] = {}
VOTERS: dict[str, dict[str, int]] = {}  # game id -> player -> gap voted for
LOCK = threading.Lock()


def remove_old_games() -> None:
    cutoff = datetime.now() - MAX_AGE
    for game_id in [gid for gid, g in GAMES.items() if g.state.started_at < cutoff]:
        del GAMES[game_id]
        VOTERS.pop(game_id, None)


def get_game_or_404(game_id: str) -> Game:
    if game_id not in GAMES:
        raise HTTPException(status_code=404, detail=f"game '{game_id}' not found")
    return GAMES[game_id]


def resolve_round(game: Game) -> None:
    """Ends the GUESS phase once the time is up: counts votes, adds the word or costs a life."""
    state = game.state
    if state.name == "draw" and state.draw_started_at:
        if datetime.now() >= state.draw_started_at + timedelta(seconds=DRAW_SECONDS):
            state.name = "wait"  # the drawing player is gone, anybody may draw now
            state.draw_started_at = None
            game.message = "The drawing player took too long."
        return
    if state.name != "guess" or state.word_submitted_at is None:
        return
    if datetime.now() < state.word_submitted_at + timedelta(seconds=GUESS_SECONDS):
        return

    voters = VOTERS.pop(game.id, {})
    votes: dict[int, int] = {}
    for gap in voters.values():
        votes[gap] = votes.get(gap, 0) + 1
    position, word = state.secret_position, state.secret_word
    correct = votes.get(position, 0) * 2 > len(voters)

    if correct:
        words = [game.words[i] for i in sorted(game.words)]
        words.insert(position, word)
        game.words = dict(enumerate(words))
        # the correct gap is split in two, later gaps move one step further
        votes = {(g + 1 if g > position else g): n for g, n in votes.items()}
        game.message = f"Correct! '{word}' was added to the pizza."
    else:
        game.lives -= 1
        game.message = f"Wrong gap! The word '{word}' belonged elsewhere."
    game.votes = votes
    game.last_position = position

    if game.lives <= 0:
        state.name = "game_over"
    elif len(game.words) >= game.max_words:
        state.name = "won"
    else:
        state.name = "wait"
    state.secret_position = None
    state.secret_word = None
    state.word_submitted_at = None


def public_view(game: Game) -> Game:
    """Resolves a finished round, hides the secret position and adds the remaining time."""
    resolve_round(game)
    state = game.state.model_copy(update={"secret_position": None})
    seconds_left = None
    started, duration = {
        "draw": (state.draw_started_at, DRAW_SECONDS),
        "guess": (state.word_submitted_at, GUESS_SECONDS),
    }.get(state.name, (None, 0))
    if started:
        deadline = started + timedelta(seconds=duration)
        seconds_left = max(0, int((deadline - datetime.now()).total_seconds() + 0.999))
    return game.model_copy(update={"state": state, "seconds_left": seconds_left})


def clean_word(word: str) -> str:
    word = " ".join(word.split())
    if not word:
        raise HTTPException(status_code=400, detail="word must not be empty")
    if len(word) > MAX_WORD_LENGTH:
        raise HTTPException(status_code=400, detail=f"word must have at most {MAX_WORD_LENGTH} characters")
    return word


@router.get("/new_game")
def new_game(
    name: str,
    words: list[str] = Query(DEFAULT_WORDS),
    max_words: int = DEFAULT_MAX_WORDS,
) -> Game:
    name = " ".join(name.split())[:40]
    if not name:
        raise HTTPException(status_code=400, detail="name must not be empty")
    if len(words) != MIN_WORDS:
        raise HTTPException(status_code=400, detail=f"exactly {MIN_WORDS} words are needed")
    if not MIN_WORDS < max_words <= LIMIT_WORDS:
        raise HTTPException(status_code=400, detail=f"max_words must be between {MIN_WORDS + 1} and {LIMIT_WORDS}")
    words = [clean_word(w) for w in words]
    if len({w.lower() for w in words}) != len(words):
        raise HTTPException(status_code=400, detail="the words must be different")
    with LOCK:
        remove_old_games()
        game_id, i = name, 2
        while game_id in GAMES:
            game_id = f"{name} ({i})"
            i += 1
        game = Game(id=game_id, words=dict(enumerate(words)), max_words=max_words)
        GAMES[game_id] = game
        return public_view(game)


@router.get("/list_games")
def list_games() -> list[str]:
    with LOCK:
        remove_old_games()
        return [
            g.id for g in sorted(GAMES.values(), key=lambda g: g.state.started_at, reverse=True)
        ]


@router.get("/game/{game_id}")
def game(game_id: str) -> Game:
    with LOCK:
        return public_view(get_game_or_404(game_id))


@router.get("/positions/{game_id}")
def positions(game_id: str) -> list[int]:
    """Gaps between slices where a new word can be inserted. Gap i lies before slice i."""
    with LOCK:
        return list(range(len(get_game_or_404(game_id).words)))


@router.get("/draw/{game_id}")
def draw(game_id: str) -> Game:
    """The first player to call this becomes the drawing player (again after DRAW_SECONDS without a word)."""
    with LOCK:
        game = get_game_or_404(game_id)
        public_view(game)  # resolves a finished round
        if game.state.name != "wait":
            raise HTTPException(status_code=409, detail=f"cannot draw in state '{game.state.name}'")
        game.state.name = "draw"
        game.state.draw_started_at = datetime.now()
        game.votes = {}
        game.last_position = None
        game.message = ""
        return public_view(game)


@router.get("/set_word/{game_id}")
def set_word(game_id: str, position: int, word: str) -> Game:
    """The drawing player picks a gap and a word. Starts the GUESS phase."""
    word = clean_word(word)
    with LOCK:
        game = get_game_or_404(game_id)
        if game.state.name != "draw":
            raise HTTPException(status_code=409, detail=f"cannot set a word in state '{game.state.name}'")
        if not 0 <= position < len(game.words):
            raise HTTPException(status_code=400, detail="position out of range")
        if word.lower() in (w.lower() for w in game.words.values()):
            raise HTTPException(status_code=400, detail=f"'{word}' is already on the pizza")
        game.state.name = "guess"
        game.state.secret_position = position
        game.state.secret_word = word
        game.state.draw_started_at = None
        game.state.word_submitted_at = datetime.now()
        VOTERS[game_id] = {}
        return public_view(game)


@router.get("/guess/{game_id}")
def guess(game_id: str, position: int, player: str) -> Game:
    """Votes for a gap. Every player has one vote, a later vote replaces the earlier one."""
    with LOCK:
        game = get_game_or_404(game_id)
        public_view(game)  # resolves a finished round
        if game.state.name != "guess":
            raise HTTPException(status_code=409, detail=f"cannot guess in state '{game.state.name}'")
        if not 0 <= position < len(game.words):
            raise HTTPException(status_code=400, detail="position out of range")
        VOTERS.setdefault(game_id, {})[player[:64]] = position
        return public_view(game)
