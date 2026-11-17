
# Word Pizza

I need a classroom game where participants create a circle of concepts. The circle shall grow from 3 to 24 items.

HTML Frontend:
- use bootstrap wherever possible
- design similar to the other games/teaching tools in templates/ 
- add the word pie to header.html
- there is a dialog to start a new game or join an existing game.
  - for starting the game there is a form: give a name to the game and specify 3 words to start with (default: data, programming, statistics). Once they press a START button, the game starts (call API endpoint and redirect to the in-game screen)
  - for joining a game, there is a list of names of currently running games (API endpoint)
- in game screen:
  - the game switchest between three states: WAIT, DRAW and GUESS and WON and GAME_OVER
  - at any point in the game, the words are visible as thick pie slices in an evenly spaced circle. The 360 degrees are divided up evenly among the slices. Each slice has a word written on it. The words ar rotated so that they fit on the slice. The pie is drawn on a canvas as SVG. The words are provided by the backend API.
  - the pie slices could have an abstract pizza design
  - in the middle, the number of lives is visible (3 at the beginning)
  - WAIT state: there is a button: draw. Whoever clicks it first, becomes the *drawing player*. The game switches to DRAW state. They pick an arrow pointing at a gap between two slices (the available positions are provided by an API endpoint). They also need to enter a word and press a button (API call). The word is invisible to the other players for now. Once a word has been sent, the game then switches to GUESS state. The API remembers a time when the word was submitted.
  - In GUESS state: all players need to click on one of the gaps between slices (indicate them by triangles on the canvas). A timer is showing. After 30 seconds, the page updates and the number of votes for each gap are shown on the pizza. A new slice is added with the entered word.
  - If more than half of the players guessed the gap correctly (the one determined in DRAW state), If the guess is wrong, the players lose 1 life. If they have 0 lifes it is GAME_OVER. If they have 24 slices, they have WON. Otherwise the game returns to DRAW state.
  - security and authentication is not critical, anyone can join anythingon Backend:
- write endpoints that I can integrate into the existing FastAPI server in /home/krother/projects/academis_website/backend as a separate Python file:

- GET list_games() -> list[game_id:str]  # removes games older than 24h
- GET game(id) -> Game
- GET draw(id) -> Game
- GET set_word(id) -> Game
- GET guess(id) -> Game

the data structures are stored in memory. It does not matter if we lose the data during a server restart, all is temporary:

GameState:
   name: "wait"|"draw"|"guess"|"won"|"game_over"
   secret_position: int(0..23)|None
   secret_word: str|None
   started_at: datetime

Game:
   state: GameState=GameState
   lives: int=3
   words: dict[position:int(0..23), str]

implement the game.
