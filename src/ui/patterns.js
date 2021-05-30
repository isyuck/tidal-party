var blessed = require("blessed")
var ui = require("./ui.js")

class Patterns {
  constructor() {
    this.node = blessed.box({
      tags: true,
      height: "60%+1",
      width: "60%-3",
      padding: { left: 1 },
      top: 1,
      left: 0,
      style: {
        fg: 'white',
        bg: 'black',
      },
      border: { fg: "#ff00ff", type: "line" },
    })
  }
  init() {
    this.node.setContent("");
    this.node.setLine(0, "{underline}{bold}patterns{/bold}{/underline}");
  }

  update(patterns) {
    this.init();
    for (let p of patterns) {
      let u = `{inverse} ${p.user} {/inverse}`
      let s = `${u} \`${p.pattern}\``
      this.node.insertBottom(s)
    }
  }
}

module.exports = Patterns
