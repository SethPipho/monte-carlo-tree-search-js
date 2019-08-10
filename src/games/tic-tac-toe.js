export class TicTacToe {
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
    cloneState(){
        return  {
            board: this.state.board.slice(0),
            playerTurn:this. state.playerTurn,
            gameOver: this.state.gameOver,
            winner: this.state.winner,
            moves: this.state.moves
        }
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