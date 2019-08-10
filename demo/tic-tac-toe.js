/*
Tic-Tac-Toe vs a Random AI 
*/

const MCTS = require('../dist/mcts-js.build.js').MCTS

class TicTacToe {
    constructor(){
        this.state = {
            board:[0,0,0,0,0,0,0,0,0],
            playerTurn: 1,
            gameOver: false,
            winner: -1,
            moves: 0
        }
        //list of all possible three in a row lines, each element is a board index
        this.rows = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    }

    getState(){
        return this.state
    }
    setState(state){
        this.state = state
    }

    //returns a deep copy of the game state 
    cloneState(){
        return  {
            board: this.state.board.slice(0),
            playerTurn:this. state.playerTurn,
            gameOver: this.state.gameOver,
            winner: this.state.winner,
            moves: this.state.moves
        }
    }

    moves(){
        let moves = []
        let board = this.state.board
        for (let i in board){
            if (board[i] == 0){
                moves.push(i)
            }
        }
        return moves
    }
    playMove(move){
        this.state.board[move] = this.state.playerTurn
        this.state.playerTurn = (this.state.playerTurn == 1) ? 2 : 1 
        this.state.moves += 1
        
        //check if any player has three in a row
        const board = this.state.board
        for (let row of this.rows){
            if (board[row[0]] != 0 && board[row[0]] == board[row[1]] && board[row[1]] == board[row[2]]){
                this.state.gameOver = true
                this.state.winner = board[row[0]]
                break
            }
        }
        
        if (this.state.moves == 9){
            this.state.gameOver = true
        }
    }

    gameOver(){
        return this.state.gameOver
    }
  
    winner(){
        //will return -1 if draw
        return this.state.winner
    }

    toString(){
        const chars = ["   ", " X ", " O "]
        const board = this.state.board.map(d => chars[d])
        return `${board[0]}|${board[1]}|${board[2]}\n-----------\n${board[3]}|${board[4]}|${board[5]}\n-----------\n${board[6]}|${board[7]}|${board[8]}\n`
    }
}

class RandomAI {
    constructor(game){
        this.game = game
    }
    selectMove(){
        const moves = this.game.moves()
        return moves[Math.floor(Math.random() * moves.length)]
    }
}

const iters = 500
const exp = 1.41

const gridLayout = ` 0 | 1 | 2 \n-----------\n 3 | 4 | 5 \n -----------\n 6 | 7 | 8 \n\n`
console.log("Welcome to TIC-TAC-TOE")
console.log("board layout:")
console.log(gridLayout)
    
let game = new TicTacToe()
let players;
//randomize who goes first
if (Math.random() < .5){
    players = [new RandomAI(game), new MCTS(game, 2, iters, exp)]
} else {
    players = [new MCTS(game, 1, iters, exp), new RandomAI(game)]
}


while (!game.gameOver()){
    const player = players[game.playerTurn() - 1]
    const choice = player.selectMove()
    game.playMove(choice)
    console.log(game.toString())
}

if (game.winner() == -1){
    console.log("Draw!")
} else if (players[game.winner() - 1] instanceof RandomAI){
    console.log("Random AI Won!")
} else {
    console.log("MCTS AI Won!")
}
    




