// Current list of games, their rules, and metadata
const ui = require("./ui/ui.js");

exports.gamesObj = {
  "Prompter" : {
      minPlayers: 1,
      expiration: 0,
      algorithm: 0,
      rules: "Prompter will give you a limited time to incorporate a function into your live code, up to 10 functions. After 10 functions, the game resets, awaiting a !restartgame command. Set difficulty with !difficulty (easy, medium, hard, and expert)",
      run: (difficulty = "easy") => {
        this.difficulty = difficulty;
        const difficultyMap = {
          //in units of milliseconds
          "easy": 30000,
          "medium": 15000,
          "hard": 10000,
          "expert": 6000
        }

        //choose a random function
        const tidalFunctions = ["fast", "slow", "iter", "rand"];
        let randomTidalFunction = tidalFunctions[Math.floor(Math.random() * tidalFunctions.length)];
        //init counter
        let counter = 0;
        //update UI with first function
        ui.game.set("prompt", randomTidalFunction, "white")
        counter++;

        //set an interval to change functions
        let gameInterval = setInterval(() => {

        randomTidalFunction = tidalFunctions[Math.floor(Math.random() * tidalFunctions.length)];
          //quit if 10
          if(counter == 10) {
            ui.game.set("prompt", "End of Game", "white");
            clearInterval(gameInterval);
          }
          //update UI with new function
          ui.game.set("prompt", randomTidalFunction, "white")
          //increment
          counter++;
        }, difficultyMap[this.difficulty]);
      }
    },
  "Sandbox" : {
      minPlayers: 1,
      expiration: 0,
      algorithm: 0,
      rules: "Be excellent to each other"
    }
}
