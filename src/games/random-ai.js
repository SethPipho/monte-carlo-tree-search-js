export class RandomAI {
    constructor(game){
        this.game = game
    }
    selectMove(){
        const moves = this.game.moves()
        return moves[Math.floor(Math.random() * moves.length)]
    }
}