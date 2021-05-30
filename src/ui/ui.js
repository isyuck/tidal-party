var blessed = require("blessed")
// local
const Info = require("./info.js")
const Patterns = require("./patterns.js")

var screen = blessed.screen({
    title: 'tidal-party',
    smartCSR: true,
    dockBorders: true,
});

let info = new Info
let patterns = new Patterns
let borderStyle = { fg: "white", type: "line" };

var mainContainer = blessed.box({
    height: "100%",
    width: "100%",
    top: 1,
    left: 0,
});

var aboutContainer = blessed.box({
    content: " {underline}{bold}about & instructions{/bold}{/underline}",
    tags: true,
    height: "100%-1",
    width: "40%+4",
    left: "60%-4",
    style: {
        fg: 'white',
        bg: 'black',
    },
    border: { fg: "#ff00ff", type: "line" },
});

var titleBox = blessed.box({
    content: ` {bold}tidal-party{/bold}  v${process.env.npm_package_version}`,
    tags: true,
    height: "shrink",
    width: "100%",
    top: 0,
    left: 0,
    style: {
        fg: 'black',
        bg: '#ff00ff',
    }
});

const render = () => {
    mainContainer.append(aboutContainer);
    screen.append(mainContainer);
    screen.append(titleBox);
    screen.append(info.node);
    screen.append(patterns.node);

    screen.render();
}

exports.info = info;
exports.patterns = patterns;
exports.render = render;
