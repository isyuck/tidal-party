import blessed from "blessed"
// local
import * as info from "./info.js"

export { info }

var screen = blessed.screen({
    title: 'tidal-party',
    smartCSR: true,
    dockBorders: true,
});

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
        bg: 'green',
    },
});

var rightContainer = blessed.box({
    parent: mainContainer,
    content: " about & instructions",
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

var userColumn = blessed.box({
    parent: patternContainer,
    content: " user column",
    height: "100%",
    width: "33%+1",
    style: {
        fg: 'white',
        bg: 'black',
    },
    border: {
        fg: "white",
        type: "line",
    },
});

var patternColumn = blessed.box({
    parent: patternContainer,
    content: " pattern column",
    height: "100%",
    width: "66%",
    left: "33%",
    style: {
        fg: 'white',
        bg: 'black',
    },
    border: {
        fg: "white",
        type: "line",
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

// export function update(patterns) {
//     let tempBox = blessed.box({
//         content: "",
//         height: "100%",
//         width: "100%",
//     });
//     for (let [i, p] of patterns.entries()) {
//         tempBox.setLine(i + 1, `${p.pattern}`)
//     }
//     patternContainer.append(tempBox)
//     render();
// }

// initalise info
info.set("", "", "");

export function render() {
    screen.append(mainContainer);
    screen.append(titleBox);
    leftContainer.append(blessed.box(info.get()))
    patternContainer.focus();
    screen.render();
}
