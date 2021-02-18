(function() {
    
    var blessed = require("blessed");

    var screen = blessed.screen({
        smartCSR: true,
        dockBorders: true
    });

    screen.title = "tidal-twitch"

    // main area
    var box = blessed.box({
        top: "center",
        left: "center",
        width: "100%",
        height: "100%",
        style: {
            fg: "black",
        }
    });

    var title = blessed.text({
        width: "66%",
        height: 1,
        padding: {left: 1},
        tags: true,
        content: "{inverse} tidal-twitch {/inverse}",
    })

    var infoTitle = blessed.text({
        width: "40%",
        left: "60%",
        tags: true,
        content: "{inverse} info & instructions {/inverse}",
        align: "right",
        height: 1,
    })

    // where active patterns are displayed
    var patternArea = blessed.box({
        top: 2,
        tags: true,
        width: "60%",
        height: "100%-2",
        padding: {left: 1, right: 1},
    })

    // tidal-twitch details and usage
    var infoArea = blessed.box({
        tags: true,
        top: 2,
        left: "60%-1",
        width: "40%+1",
        height: "100%-2",
        padding: {left: 1, right: 1},
    })

    // exit with 'q' or 'ctrl-c'
    screen.key(["q", "C-c"], function(ch, key) {
        return process.exit(0);
    });

    // TODO some visual indication that we are connected to twitch
    module.exports.onTwitchConnected = function(addr, port) {
        // twitchInfo.style.bg = "green"
        // title.style.bg = "green"
        // twitchInfo.content = `${addr}:${port}`
        screen.render();
    }

    module.exports.addConnection = function(i, connection) {
        var effects = "";
        if (connection.effects.length) {
            for (const e of connection.effects) {
                effects += `# ${e.name} \"${e.pattern}\"`
            }
        }
        patternArea.setLine(i * 2, `{inverse} ${connection.user} {/inverse} \"${connection.pattern}\" ${effects}`)
        screen.render();
    }

    module.exports.render = function() {
        screen.append(box);
        box.append(title);
        box.append(patternArea);
        box.append(infoTitle);
        box.append(infoArea);
        infoArea.setContent(
            "tidal-twitch is an experiment in collaborative music. it uses twitch chat messages to control tidalcycles."
            + "\n\n\n" + "to add your pattern, send a message like:"
            + "\n\n" + "{inverse} !t \"bd cp sn hh\" {/inverse}"
            + "\n\n\n" + "effects also work, e.g:"
            + "\n\n" + "{inverse} !t \"psr*4\" # speed \"1 2 3 4\" {/inverse}"
            + "\n\n\n" + "there are a maximum number of 8 patterns allowed at any one time. the patterns are arranged on a time based stack, so the oldest pattern in the stack will be overwritten by the most recent. however, if you already have an active pattern, your active pattern will be replaced by your new one, rather than you replacing someone elses."
            + "\n\n" + "samples available are the default Dirt samples, a list of which can be found at tidalcycles/Dirt-Samples on GitHub."
        )
        box.focus();
        screen.render();
    }
}());
