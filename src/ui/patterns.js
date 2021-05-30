var blessed = require("blessed")
var ui = require("./ui.js")

class Patterns {
  constructor() {
    this.node = blessed.box({
      content: " {underline}{bold}patterns{/bold}{/underline}",
      tags: true,
      height: "60%+1",
      width: "60%-3",
      top: "0%+1",
      left: 0,
      style: {
        fg: 'white',
        bg: 'black',
      },
      border: { fg: "#ff00ff", type: "line" },
    })
  }

  update(patterns) {
    let s = "";
    for (let [i, p] of patterns.entries()) {
      let u = `{bold}${p.user.padEnd(15, ' ')}{/bold}`
      s += `\n ${u}${p.pattern}`
    }
    this.node.content = " {underline}{bold}patterns{/bold}{/underline}" + s;

  }
}

module.exports = Patterns
