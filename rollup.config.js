// rollup.config.js
export default {
  input: 'index.js',
  output: {
    file: 'dist/mcts-js.build.js',
    format: 'umd',
    name: 'Axon'
  }
};