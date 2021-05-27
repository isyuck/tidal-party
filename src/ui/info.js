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

// whatever info we want to show. the color applies to the state
let infoLines = [
    new InfoLine("connected", "false", "red"),
    new InfoLine("uptime", "00:00:00", "white"),
    new InfoLine("channel", "", "white"),
    new InfoLine("bot account", "", "white"),
    new InfoLine("max patterns", "", "white"),
    new InfoLine("expiration", "", "white"),
    new InfoLine("algorithm", "", "white"),
];

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
// this also updates the whole container
export function set(title, state, color) {
    let s = "";
    for (let info of infoLines) {
        // update info line
        if (title == info.title) {
            info.state = state;
            info.color = color;
        }
        // append each line into s
        s += info.get()
    }
    container.content = " {inverse}info{/inverse}" + s;
}

export function get() {
    return container;
}
