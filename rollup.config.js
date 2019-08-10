// rollup.config.js
export default [{
  input: 'index.js',
  output: {
    file: 'dist/mcts-js.build.js',
    format: 'umd',
    name: 'MCTS'
  },
  input: 'src/games/index.js',
  output: {
    file: 'dist/games.build.js',
    format: 'umd',
    name: 'Games'
  },

}];