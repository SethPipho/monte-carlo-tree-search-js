const MCTS = require('../dist/mcts-js.build.js').MCTS

class Connect4 {
    constructor(){
        this.width = 7
        this.height = 6

        this.state = {
            board: new Array(this.width * this.height).fill(0),
            playerTurn: 1,
            gameOver: false,
            winner: -1,
            moves: 0,
            lastMoveIndex: -1, //index of last piece places
            lastPlayer: -1,
        }
    }

    getState(){
        return this.state
    }
    setState(state){
        this.state = state
    }

    cloneState(){
        return  {
            board: this.state.board.slice(0),
            playerTurn:this. state.playerTurn,
            gameOver: this.state.gameOver,
            winner: this.state.winner,
            moves: this.state.moves,
            lastPlayer: this.state.lastPlayer,
            lastMoveIndex: this.state.lastMoveIndex
        }
    }

    playerTurn(){
        return this.state.playerTurn
    } 

    moves(){
        let moves = []
        for (let i = 0; i < this.width; i++){
            if (this.state.board[i] == 0){
                moves.push(i)
            }
        }
        return moves
    }
    playMove(move){
        let board = this.state.board;
        let index;
        for (let i = this.height - 1; i >= 0; i--){
            index = i * this.width + move
            if (board[index] == 0){
                board[index] = this.state.playerTurn
                break
            }
        }
        this.state.lastMoveIndex = index
        this.state.lastPlayer = this.state.playerTurn
        this.state.playerTurn = (this.state.playerTurn == 1) ? 2 : 1 
        this.state.moves += 1
        
    }


    gameOver(){
        if (this.state.moves <= 7){
            return false
        }

        const board = this.state.board
        const lastPlayer = this.state.lastPlayer
        const lastMoveIndex = this.state.lastMoveIndex
        const lastMoveRow = Math.floor(lastMoveIndex / this.width)
        const lastMoveCol = lastMoveIndex % this.width

        //check for horizontal connect 4
        let startCol = Math.max(0, lastMoveCol - 3)
        let endCol = Math.min(this.width - 1, lastMoveCol + 3)

        let count = 0
        for (let col = startCol; col <= endCol; col++){
            const index = this.width * lastMoveRow + col
            if (board[index] == lastPlayer){
                count += 1
            } else {
                count = 0
            }
            if (count == 4){
                this.state.winner = lastPlayer
                this.state.gameOver = true
                return true
            }
        }

        //check for vertical connect 4
        let startRow = Math.max(0, lastMoveRow - 3)
        let endRow = Math.min(this.width - 1, lastMoveRow + 3)

        count = 0
        for (let row = startRow; row <= endRow; row++){
            const index = this.width * row + lastMoveCol
            if (board[index] == lastPlayer){
                count += 1
            } else {
                count = 0
            }
            if (count == 4){
                this.state.winner = lastPlayer
                this.state.gameOver = true
                return true
            }
        }


        //check for diagonal connect 4, top left to bottom right
        let row = lastMoveRow - 3
        let col = lastMoveCol - 3

        count = 0

        for (let i = 0; i < 7; i++){
            if (row < 0 || col < 0) {continue}
            if (row >= this.height || col >= this.width) {break}
            const index = this.width * row + col
            if (board[index] == lastPlayer){
                count += 1
            } else {
                count = 0
            }
            if (count == 4){
                this.state.winner = lastPlayer
                this.state.gameOver = true
                return true
            }
            row += 1
            col += 1
        }


        //check for diagonal connect 4, bottom left to top right
        row = lastMoveRow + 3
        col = lastMoveCol - 3

        count = 0

        for (let i = 0; i < 7; i++){
            if (row < 0 || col < 0) {continue}
            if (row >= this.height || col >= this.width) {break}
            const index = this.width * row + col
            if (board[index] == lastPlayer){
                count += 1
            } else {
                count = 0
            }
            if (count == 4){
                this.state.winner = lastPlayer
                this.state.gameOver = true
                return true
            }
            row -= 1
            col += 1
        }
        if (this.state.moves == this.width * this.height){
            this.state.gameOver = true
            return true
        }
        return false
    }

    winner(){
        return this.state.winner
    }

    toString(){
        let chars = []
        let board = this.state.board
        for (let i in board){
            if (board[i] == 0){
                chars.push("*")
            } else {
                chars.push(board[i].toString())
            }
            chars.push(" ")
            if (i % this.width == this.width - 1){
                chars.push("\n")
            }
        }
        return chars.join("")
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


/*
let game = new Connect4()
let players = [new RandomAI(game), new RandomAI(game)]

while (!game.gameOver()){
    console.log("---------------------------------------")
    const player = players[game.playerTurn() - 1]
    const choice = player.selectMove()
    game.playMove(choice)
    console.log(game.toString())
}

console.log("Player", game.winner(), "Won!")
*/



let draws = 0
let mctsWins = 0
let randomWins = 0
let num_games = 100

console.log("Connect 4")
for (let i = 0; i < num_games; i++){
    console.log(i)
    
    let game = new Connect4()
    let players;
    //randomize who goes first
    if (Math.random() < .5){
        players = [new RandomAI(game), new MCTS(game, 2)]
    } else {
        players = [new MCTS(game, 1), new RandomAI(game)]
    }

    //players = [new MCTS(game, 1), new MCTS(game, 2)]

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
console.log("MTCS win percentage:", mctsWins/num_games)
console.log("Draw Percentage:", draws/num_games)
console.log("MCTS win + draw percentage:", (draws + mctsWins)/num_games)
