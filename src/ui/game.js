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
    // this.node.pushLine("there is no game currently active :-(")
  }




  // update the state and color of an info line using it's title.
    // this also updates the whole container. if a title matching
    // the one passed isn't found, it gets added.
    set(title, state, color) {
        this.init();
        // ignore blanks
        if (title == "" || state == "" || color == "") { return }
        // add by default
        let newelem = true;
        if (gameLines.length) {
            for (let info of gameLines) {
                // update info line, don't add
                if (title == info.title) {
                    info.state = state;
                    info.color = color;
                    newelem = false;
                }
                this.node.insertBottom(info.get())
            }
        }
        if (newelem) {
            gameLines.push(new GameLine(title, state, color));
            this.node.insertBottom(gameLines[gameLines.length - 1].get())
        }
    }

}

let gameLines = [];

// contains a 'line' of info, e.g. connection and status,
// and some formatting
class GameLine {
    constructor(_title, _state, _color) {
        this.title = _title;
        this.state = _state;
        this.color = _color;
    }
    // return the formatted info
    get() {
        // it looks ugly..
        return `${this.title}`.padEnd(14, ' ')
            + `{bold}{${this.color}-fg}${this.state}{/${this.color}-fg}{/bold}`;
    }
};

module.exports = Game;
