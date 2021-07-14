const { config } = require("../config/config.js")
const ui = require("./ui/ui.js");
const { algorithms } = require("./algorithms.js");

// generic game
class Game {
  constructor(c) {
    this.title = c.title;
    this.active = false;            // TODO use this
    this.minPlayers = c.minPlayers; // TODO use this
    this.expiration = c.expiration; // TODO ask justin about what this does
    this.algorithm = c.algorithm;
    this.rulesDesc = c.rulesDesc;
    this.difficulty = c.difficulty;
    // object to allow each game to get and set a state that exists
    // outside of run()'s scope, e.g. a counter
    this.state = c.state;
    // a loopable function, useful for some games
    this.gameLoop = c.gameLoop;
    // how often to loop
    this.interval = c.interval;
    // do something with a pattern
    this.gameUpdate = c.gameUpdate;
  }

  // run the loop fn passed in the constructor, and some other stuff
  loop(patterns) {
    let gamed = this.gameLoop(this.state, patterns);
    this.state = gamed.state;
    return gamed.patterns;
  }
  // run the update fn to modify patterns;
  update(latest, patterns) {
    let gamed = this.gameUpdate(this.state, latest, patterns);
    this.state = gamed.state;
    return algorithms[this.algorithm](
      gamed.latest,
      gamed.patterns,
      config.maxActivePatterns
    );
  }
}

// change game with a string
exports.change = (gameName) => {
  // resort to game[0] by default
  // TODO notify user their game couldn't be found, and keep
  // the currently active game active
  let currentGame = games[0];
  for (let game of games) {
    if (game.title.toLowerCase() == gameName.toLowerCase()) {
      currentGame = game;
    }
  }

  ui.game.set("name", currentGame.title, "blue");
  ui.game.set("rules", currentGame.rulesDesc, "blue");
  ui.game.set("difficulty", currentGame.difficulty, "blue")

  return currentGame;
}

// array of all the games, declare them here (will probably move games to
// individual files if there are enough / they are complex enogh)
// TODO this should totally use inheritance rather than this terrible
// constructor shit that's going on right now...
let games = [
  new Game({
    title: "Sandbox",
    minPlayers: 1,
    expiration: 0,
    algorithm: 0,
    interval: 250,
    rulesDesc: "Be excellent to each other!",
    difficulty: "easy",
    gameLoop: (state, patterns) => {
      newState = state + 1;
      return { state: newState, patterns: patterns };
    },
    gameUpdate: (state, latest, patterns) => {
      return { state: state, latest: latest, patterns: patterns };
    }
  }
  ),
  new Game({
    title: "Prompter",
    minPlayers: 1,
    expiration: 0,
    state: 0,
    interval: 1000,
    algorithm: 0,
    rulesDesc: "Prompter will give you a limited time to incorporate a function into your live code, up to 10 functions. After 10 functions, the game resets, awaiting a !restartgame command. Set difficulty with !difficulty (easy, medium, hard, and expert)",
    difficulty: "easy",
    gameLoop: (state, patterns) => {
      // not used yet
      const difficultyMap = {
        // in units of milliseconds
        "easy": 30000,
        "medium": 15000,
        "hard": 10000,
        "expert": 6000
      }

      const tidalFunctions = ["fast", "slow", "iter", "rand"];
      let randomTidalFunction = tidalFunctions[Math.floor(Math.random() * tidalFunctions.length)];
      newState = state + 1;
      ui.game.set("prompt", randomTidalFunction, "white");
      if (state == 10) {
        ui.game.set("prompt", "End of Game", "white");
      }

      return { state: newState, patterns: patterns };
    },
    gameUpdate: (state, latest, patterns) => {
      return { state: state, latest: latest, patterns: patterns };
    }
  }
  ),
];
