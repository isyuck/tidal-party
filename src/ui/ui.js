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

var mainContainer = blessed.box({
    height: "100%",
    width: "100%",
    top: 1,
    left: 0,
});

var leftContainer = blessed.box({
    parent: mainContainer,
    height: "100%",
    width: "60%",
    style: {
        fg: '#ff00ff',
        bg: 'black',
    },
});

var rightContainer = blessed.box({
    parent: mainContainer,
    content: " {underline}about & instructions{/underline}",
    tags: true,
    height: "100%-1",
    width: "40%+4",
    left: "60%-4",
    style: {
        fg: 'white',
        bg: 'black',
    },
    border: {
        fg: "white",
        type: "line",
    },
});

var patternContainer = blessed.box({
    parent: leftContainer,
    height: "66%",
    width: "100%",
    style: {
        fg: 'black',
        bg: 'black',
    },
});

var titleBox = blessed.box({
    content: " tidal-party",
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
    screen.append(mainContainer);
    screen.append(titleBox);
    screen.append(info.node);
    screen.append(patterns.node);

    screen.render();
}

exports.info = info;
exports.patterns = patterns;
exports.render = render;
