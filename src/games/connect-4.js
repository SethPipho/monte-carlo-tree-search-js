export class Connect4 {
    constructor(width, height){

        let _width = width | 7
        let _height = height | 6
        
        this.state = {
            width: _width,
            height: _height,
            board: new Array(_width * _height).fill(0),
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
            width:this.state.width,
            height: this.state.height,
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
        for (let i = 0; i < this.state.width; i++){
            if (this.state.board[i] == 0){
                moves.push(i)
            }
        }
        return moves
    }
    playMove(move){
        let board = this.state.board;
        let index;
        for (let i = this.state.height - 1; i >= 0; i--){
            index = i * this.state.width + move
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
        if (this.state.moves < 7){
            return false
        }
        const board = this.state.board
        const lastPlayer = this.state.lastPlayer
        const lastMoveIndex = this.state.lastMoveIndex
        const lastMoveRow = Math.floor(lastMoveIndex / this.state.width)
        const lastMoveCol = lastMoveIndex % this.state.width

        //check for horizontal connect 4
        let startCol = Math.max(0, lastMoveCol - 3)
        let endCol = Math.min(this.state.width - 1, lastMoveCol + 3)

        let count = 0
        for (let col = startCol; col <= endCol; col++){
            const index = this.state.width * lastMoveRow + col
            if (board[index] === lastPlayer){
                count += 1
            } else {
                count = 0
            }
            if (count === 4){
                this.state.winner = lastPlayer
                this.state.gameOver = true
                return true
            }
        }

        //check for vertical connect 4
        let startRow = Math.max(0, lastMoveRow - 3)
        let endRow = Math.min(this.state.width - 1, lastMoveRow + 3)

        count = 0
        for (let row = startRow; row <= endRow; row++){
            const index = this.state.width * row + lastMoveCol
            if (board[index] === lastPlayer){
                count += 1
            } else {
                count = 0
            }
            if (count === 4){
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
            if (row >= this.state.height || col >= this.state.width) {continue}
            const index = this.state.width * row + col
            if (board[index] === lastPlayer){
                count += 1
            } else {
                count = 0
            }
            if (count === 4){
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
            if (row >= this.state.height || col >= this.state.width) {continue}
            const index = this.state.width * row + col
            if (board[index] === lastPlayer){
                count += 1
            } else {
                count = 0
            }
            if (count === 4){
                this.state.winner = lastPlayer
                this.state.gameOver = true
                return true
            }
            row -= 1
            col += 1
        }
        if (this.state.moves == this.state.width * this.state.height){
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
            if (i % this.state.width == this.state.width - 1){
                chars.push("\n")
            }
        }
        return chars.join("")
    }
}