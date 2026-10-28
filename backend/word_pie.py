"""
Word Pizza: a classroom game where participants build a circle of concepts.

All data is kept in memory. Integrate into the FastAPI app with:

    from word_pie import router as word_pie_router
    app.include_router(word_pie_router)
"""
import random
import threading
from datetime import datetime, timedelta
from typing import Annotated, Literal

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

MIN_WORDS = 3
MAX_WORDS = 24
START_LIVES = 3
MAX_WORD_LENGTH = 20
MAX_AGE = timedelta(hours=24)
DEFAULT_WORDS = ["data", "programming", "statistics"]

router = APIRouter(prefix="/word_pie", tags=["word_pie"])


class GameState(BaseModel):
    name: Literal["wait", "draw", "guess", "won", "game_over"] = "wait"
    secret_position: int | None = None  # gap index: new word is inserted before words[i]
    secret_word: str | None = None
    started_at: datetime = Field(default_factory=datetime.now)


class Game(BaseModel):
    id: str
    state: GameState = Field(default_factory=GameState)
    lives: int = START_LIVES
    words: dict[int, str]
    message: str = ""


GAMES: dict[str, Game] = {}
LOCK = threading.Lock()


def remove_old_games() -> None:
    cutoff = datetime.now() - MAX_AGE
    for game_id in [gid for gid, g in GAMES.items() if g.state.started_at < cutoff]:
        del GAMES[game_id]


def get_game_or_404(game_id: str) -> Game:
    if game_id not in GAMES:
        raise HTTPException(status_code=404, detail=f"game '{game_id}' not found")
    return GAMES[game_id]


def public_view(game: Game) -> Game:
    """Hides the secret position from players who did not draw.
    The secret word only exists from GUESS state on, when everybody may see it."""
    state = game.state.model_copy(update={"secret_position": None})
    return game.model_copy(update={"state": state})


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
    words: Annotated[list[str], Query()] = DEFAULT_WORDS,
) -> Game:
    name = " ".join(name.split())[:40]
    if not name:
        raise HTTPException(status_code=400, detail="name must not be empty")
    if len(words) != MIN_WORDS:
        raise HTTPException(status_code=400, detail=f"exactly {MIN_WORDS} words are needed")
    words = [clean_word(w) for w in words]
    with LOCK:
        remove_old_games()
        game_id, i = name, 2
        while game_id in GAMES:
            game_id = f"{name} ({i})"
            i += 1
        game = Game(id=game_id, words=dict(enumerate(words)))
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


@router.get("/draw/{game_id}")
def draw(game_id: str) -> Game:
    """Picks a random gap. Only the response of this call reveals the position."""
    with LOCK:
        game = get_game_or_404(game_id)
        if game.state.name not in ("wait", "draw"):
            raise HTTPException(status_code=409, detail=f"cannot draw in state '{game.state.name}'")
        game.state.name = "draw"
        game.state.secret_position = random.randrange(len(game.words))
        game.state.secret_word = None
        game.message = ""
        return game.model_copy(deep=True)


@router.get("/set_word/{game_id}")
def set_word(game_id: str, word: str) -> Game:
    word = clean_word(word)
    with LOCK:
        game = get_game_or_404(game_id)
        if game.state.name != "draw":
            raise HTTPException(status_code=409, detail=f"cannot set a word in state '{game.state.name}'")
        if word.lower() in (w.lower() for w in game.words.values()):
            raise HTTPException(status_code=400, detail=f"'{word}' is already on the pizza")
        game.state.name = "guess"
        game.state.secret_word = word
        return public_view(game)


@router.get("/guess/{game_id}")
def guess(game_id: str, position: int) -> Game:
    with LOCK:
        game = get_game_or_404(game_id)
        state = game.state
        if state.name != "guess":
            raise HTTPException(status_code=409, detail=f"cannot guess in state '{state.name}'")
        if not 0 <= position < len(game.words):
            raise HTTPException(status_code=400, detail="position out of range")

        if position == state.secret_position:
            words = [game.words[i] for i in sorted(game.words)]
            words.insert(position, state.secret_word)
            game.words = dict(enumerate(words))
            game.message = f"Correct! '{state.secret_word}' was added to the pizza."
        else:
            game.lives -= 1
            game.message = f"Wrong gap! The word was '{state.secret_word}'."

        if game.lives <= 0:
            state.name = "game_over"
        elif len(game.words) >= MAX_WORDS:
            state.name = "won"
        else:
            state.name = "wait"
        state.secret_position = None
        state.secret_word = None
        return public_view(game)
