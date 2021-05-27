const pl = 27;  // pad length
const pc = ' '; // pad char

class InfoLine {
    constructor(_title, _state, _color) {
        this.title = _title;
        this.state = _state;
        this.color = _color;
    }
    get() {
        return "\n " + `{bold}${this.title}{/bold}:`.padEnd(pl, pc)
            + `{${this.color}-fg}${this.state}{/${this.color}-fg}`;
    }
};

let infoLines = [
    new InfoLine("connected", "false", "red"),
    new InfoLine("uptime", "00:00:00", "white"),
    new InfoLine("channel", "", "white"),
    new InfoLine("bot account", "", "white"),
    new InfoLine("max patterns", "", "white"),
    new InfoLine("expiration", "", "white"),
    new InfoLine("algorithm", "", "white"),
];

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

export function set(title, state, color) {
    let s = "";
    if (color == "") {
        color = "white"
    }
    for (let info of infoLines) {
        if (title == info.title) {
            info.state = state;
            info.color = color;
        }
        s += info.get()
    }
    container.content = " {inverse}info{/inverse}" + s;
}

export function get() {
    return container;
}
