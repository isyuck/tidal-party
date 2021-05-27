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
        return "\n " + `{bold}${this.title}{/bold}:`.padEnd(27, ' ')
            + `{${this.color}-fg}${this.state}{/${this.color}-fg}`;
    }
};

let infoLines = [];

// what contains the info lines
var container = {
    tags: true,
    height: "33%+2",
    width: "100%-3",
    top: "66%-1",
    left: 0,
    style: {
        fg: 'white',
        bg: 'black',
    },
    border: {
        fg: "white",
        type: "line",
    },
};

// update the state and color of an info line using it's title.
// this also updates the whole container. if a title matching
// the one passed isn't found, it gets added.
export function set(title, state, color) {
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
    container.content = " {inverse}info{/inverse}" + s;
}

export function get() {
    return container;
}
