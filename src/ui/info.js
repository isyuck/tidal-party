var blessed = require("blessed")
// contains a 'line' of info, e.g. connection and status,
// and some formatting
class InfoLine {
    constructor(_title, _state, _color) {
        this.title = _title;
        this.state = _state;
        this.color = _color;
    }
    // return the formatted info
    get() {
        // it looks ugly..
        return "\n " + `${this.title}`.padEnd(14, ' ')
            + `{bold}{${this.color}-fg}${this.state}{/${this.color}-fg}{/bold}`;
    }
};

let infoLines = [];

class Info {
    constructor() {
        this.node = blessed.box({
            tags: true,
            height: "33%+3",
            width: "60%-3",
            top: "66%-1",
            left: 0,
            style: {
                fg: 'white',
                bg: 'black',
            },
            border: {
                fg: "white",
                type: "line",
            }
        })
    }

    // update the state and color of an info line using it's title.
    // this also updates the whole container. if a title matching
    // the one passed isn't found, it gets added.
    set(title, state, color) {
        // ignore blanks
        if (title == "" || state == "" || color == "") { return }
        // string to append lines into
        let s = "";
        // add by default
        let newelem = true;
        if (infoLines.length) {
            for (let info of infoLines) {
                // update info line, don't add
                if (title == info.title) {
                    info.state = state;
                    info.color = color;
                    newelem = false;
                }
                // append each line onto s
                s += info.get()
            }
        }
        if (newelem) {
            infoLines.push(new InfoLine(title, state, color));
            s += infoLines[infoLines.length - 1].get()
        }
        this.node.content = " {underline}info{/underline}" + s;
    }
}

module.exports = Info;
