const add = require("../dist/mcts-js.build.js").add

test("Test add", () => {
    expect(add(2,2)).toBe(4)
}) 