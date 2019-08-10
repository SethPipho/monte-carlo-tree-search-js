# monte-carlo-tree-search-js
A general purpose Monte Carlo Tree Search AI in Javascript.

[Live Demo!](https://sethpipho.github.io/monte-carlo-tree-search-js/demo/connect-4/)

[Monte Carlo Tree Search](https://en.wikipedia.org/wiki/Monte_Carlo_tree_search) is a simple, yet powerful search heauristic commly used to implement game playing AIs.

In it's most basic form, MCTS can effectivly play any discrete, deterministic, perfect information game (e.g. checkers, chess, go, connect4, reversi, etc) without requiring any additional domain specific knowledge. 

### Usage

Using monte-carlo-tree-search-js is simple. 

First, implement a game. To do this, encapsulate the game logic into a class that implements several basic methods:

See ["demo/tic-tac-toe.js"](https://github.com/SethPipho/monte-carlo-tree-search-js/blob/master/demo/tic-tac-toe.js) for a simple example.

Also see ["demo/connect-4"](https://github.com/SethPipho/monte-carlo-tree-search-js/blob/master/demo/connect-4/index.html)
and ["src/games/connect-4.js"](https://github.com/SethPipho/monte-carlo-tree-search-js/blob/master/src/games/connect-4.js) for source of online demo.


```javascript

class Connect4Game {

    constructor(){
        this.state = {...}
    }

    getState(){/*returns a single object containg's game state*/}
    setState(state){/* set game internal state */}
    cloneState(){/* returns a DEEP copy of game state */}

    moves(){/* returns list of valid moves given current game state*/}
    playMove(move){/* play a move, move being an element from .moves() list */}
    gameOver(){/* True if game is over, false otherwise */}
    winner(){/* number of winning player, -1 if draw" */}
}

```

From here, actually using the MCTS AI is very simple.

~~~ javascript

/*
Basic AI vs AI action
*/

let game = new Connect4Game()

let iterations = 1000 //more iterations = means stronger AI, more computation
let exploration = 1.41 //exploration vs. explotation parameter, sqrt(2) is reasonable default

let player1 = new MCTS(game, 1 , iterations, exploration)
let player2 = new MCTS(game, 2 , iterations, exploration)

while (true){
    let p1_move = player1.selectMove()
    game.playMove(p1_move)

    if (game.gameOver()) {break}

    let p2_move = player2.selectMove()
    game.playMove(p2_move)

    if (game.gameOver()) {break}
}

console.log(game.winner())

~~~





