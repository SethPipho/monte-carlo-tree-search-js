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

        //list of all possible three in a row lines, each element corresponds to board index
        this.rows = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ]
    }

    getState(){
        return this.state
    }
    setState(state){
        this.state = state
    }
    playerTurn(){
        return this.state.playerTurn
    } 
    moves(){
        return this.state.board.reduce((empty, d, i) => {
            if (d == 0){
                empty.push(i)
            }
            return empty
        }, [])
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


const gridLayout = ` 0 | 1 | 2 \n-----------\n 3 | 4 | 5 \n -----------\n 6 | 7 | 8 \n\n`
console.log("Welcome to TIC-TAC-TOE")
console.log("board layout:")
console.log(gridLayout)


let draws = 0
let mctsWins = 0
let randomWins = 0
let num_games = 1000


for (let i = 0; i < num_games; i++){
    console.log(i)
    let game = new TicTacToe()
    let players;
    //randomize who goes first
    if (Math.random() < .5){
        players = [new RandomAI(game), new MCTS(game, 2)]
    } else {
        players = [new MCTS(game, 1), new RandomAI(game)]
    }

    //players = [new MCTS(game, 1), new MCTS(game,2)]

    while (!game.gameOver()){
        const player = players[game.playerTurn() - 1]
        const choice = player.selectMove()
        game.playMove(choice)
        //console.log(game.toString())
    }
    
    if (game.winner() == -1){
       draws += 1
    } else if (players[game.winner() - 1] instanceof RandomAI){
      randomWins += 1
    
    } else {
        mctsWins += 1
    }
}

console.log("Draws", draws)
console.log("Random Wins", randomWins)
console.log("MCTS wins", mctsWins)
console.log("MCTS win + draw percentage:", (draws + mctsWins)/num_games)








