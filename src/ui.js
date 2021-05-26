import blessed from "blessed"

var screen = blessed.screen({
    smartCSR: true
});

screen.title = 'tidal-party';
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

var box = blessed.box({
    content: 'Hello world!',
});

export function update(patterns) {
    box.setContent(patterns[0].user);

    render();
}

export function render() {
    screen.append(box);
    box.focus();
    screen.render();
}
