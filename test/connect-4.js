/*
Connect 4 vs a Random AI, should win or draw ~100% of games

To Run: node connect-4.js
*/

const MCTS = require('../dist/mcts-js.build.js').MCTS
const Games =  require('../dist/games.build.js')

let draws = 0
let mctsWins = 0
let randomWins = 0
let num_games = 100
let mctsIters = 1000

console.log("Connect 4")
for (let i = 0; i < num_games; i++){
    console.log(i)
    
    let game = new Games.ConnectN(7,6,4)
    let players;
    
    //randomize who goes first
    if (Math.random() < .5){
        players = [new Games.RandomAI(game), new MCTS(game, 2, mctsIters)]
    } else {
        players = [new MCTS(game, 1, mctsIters), new Games.RandomAI(game)]
    }

    

    while (!game.gameOver()){
        const player = players[game.playerTurn() - 1]
        const choice = player.selectMove()
        game.playMove(choice)
        //console.log(game.toString())
    }
    
    if (game.winner() == -1){
       draws += 1
    } else if (players[game.winner() - 1] instanceof Games.RandomAI){
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
