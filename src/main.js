// local
const { config } = require("../config/config.js");
const { algorithms } = require("./algorithms.js");
const tmi = require("tmi.js");
const tidal = require("./tidal.js");
const ui = require("./ui/ui.js");
const games = require("./games.js");
const commands = require("./cmds.js");

// represents the current 'state' of tidal-party, and
// some functions for interfacing with other parts of it
let state = {
  // the list of all active patterns
  patterns: [],
  // load config by default
  maxActivePatterns: config.maxActivePatterns,
  // the group structure
  groups: [],
  // the current game
  game: {
    current: null,
    intervalID: 0,
    // change the game
    changeTo: (title) => {

      state.game.current = games.change(title);
      clearInterval(state.game.intervalID);
      state.game.intervalID = setInterval(() => {
        // just run the game with the current patterns
        // required to use timing in games
        patterns = state.game.current.loop(state.patterns);
      }, state.game.current.interval);

      reset();
    }
  },
  // the msg counter
  totalmsgs: 0,
  // run this when a change to state is made
  update: () => {
    // create a string to prepend to each pattern. `X` gets
    // replaced by the position of the pattern in the list,
    // e.g. for the fourth pattern X = 4
    const prepend = (state.game.current.expiration != 0)
      ? `mortal X ${state.game.current.expiration} 1`
      : `jumpIn' X 1`;

    // send patterns to tidal
    tidal.writePatterns(state.patterns, prepend);
    ui.patterns.update(state.patterns);
    state.setUpdateFlag = false;

    ui.render();
  },
}

const twitch = new tmi.Client(config.twitch);

const run = () => {

  // load the sandbox (default)
  state.game.current = games.change("Sandbox");

  // connect to twitch, start tidal
  tidal.start();
  twitch.connect().catch()

  twitch.on("connected", () => {
    ui.info.set("connected", "true", "green")
    ui.render();
  });
  twitch.on("message", onMessageHandler);

  // create & initialise info UI // TODO update when options are changed while running
  ui.info.set("connected", "false", "red");
  ui.info.set("channel", `${config.twitch.channels}`.replace("#", ""), "blue");
  ui.info.set("bot account", config.twitch.identity.username, "blue");
  ui.info.set("max patterns", state.maxActivePatterns, "blue");
  ui.info.set("expiration", `${config.expiration} cycles`, "blue");

  ui.info.set("total msgs", `${state.totalmsgs}`, "blue");
  ui.info.set("uptime", "00:00:00", "blue");
  ui.info.set("fav sample", "todo", "red");
  ui.info.set("msg count", "todo", "red");

  // update the uptime in the ui
  setInterval(() => {
    ui.info.set("uptime",
      `${new Date(process.uptime() * 1000).toISOString().substr(11, 8)}`,
      "white")
    ui.render();
  }, 1000);

  ui.render();
}

function onMessageHandler(target, context, msg, self) {
  // ignore messages from the bot
  if (self) {
    return;
  } else {

    // update the total messages
    state.totalmsgs += 1;
    ui.info.set("total msgs", `${state.totalmsgs}`, "blue");

    // get the new state and a message from commands.run()
    let result = commands.run(state, context, msg);
    // update the state
    state = result.state;
    state.update();
    // send a message (no message if result.message is empty)
    twitch.say(target, result.output);
  }
}

function reset(target) {
  // TODO hush
  patterns = [];
  state.update();
  twitch.say(target, "hold the phone, tidal-party has been reset");
}

exports.run = run
