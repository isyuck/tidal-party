var blessed = require("blessed")

class Game {
  constructor() {
    this.node = blessed.box({
      tags: true,
      height: "33%+3",
      padding: { left: 1 },
      width: "40%+1",
      top: "66%-1",
      left: "20%-4",
      style: {
        fg: 'white',
        bg: 'black',
      },
      border: { fg: "#ff00ff", type: "line" },
    })
  }

  init() {
    this.node.setContent("");
    this.node.setLine(0, "{underline}{bold}game{/bold}{/underline}");
    this.node.pushLine("there is no game currently active :-(")
  }

}

module.exports = Game;
