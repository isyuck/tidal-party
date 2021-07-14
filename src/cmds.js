class Command {
  constructor(cmd, mod, fn) {
    this.cmd = cmd;
    this.mod = mod;
    this.fn = fn;
  }
  run(state, context, message) {
    if (this.mod) {
      if (context.mod || context.badges.broadcaster) {
        return this.fn(state, context, message);
      } else {
        return {
          state: state,
          message: `@${context.username}, you cannot use this command because you are not a mod`
        }
      }
    } else {
      return this.fn(state, context, message);
    }
  }
};

// interface to all of our commands
exports.run = (state, context, message) => {
  const splitmsg = message.split(" ");
  for (let command of commands) {
    if (command.cmd == splitmsg[0]) {
      return command.run(state, context, message);
    }
  }

  if (message.charAt(0) == "!") {
    return makeResult(state, `that command doesn't exist!`);
  } else {
    return makeResult(state, "");
  }

}

// saves some typing, and makes changing return type easier in future
const makeResult = (state, output) => {
  return { state: state, output: output };
}

let commands = new Array(
  // handle a tidal pattern
  new Command(
    "!t",
    false,
    (state, context, message) => {
      // parse twitch message into object
      const output = message.substr(message.indexOf(" ") + 1);
      const latest = {
        user: context.username,
        pattern: output,
      };
      // update the patterns using the current game
      state.patterns = state.game.current.update(latest, state.patterns);
      // return makeResult(state, `@${context.username}: ${output}`);
      return makeResult(state, "");
    }
  ),
  // handle a tidal pattern (pose as user)
  new Command(
    "!u",
    true,
    (state, context, message) => {
      const output = message.split(" ").slice(2).join(" ");
      const fakeuser = message.split(" ").splice(1, 1);
      const latest = {
        user: fakeuser,
        pattern: output,
      };
      state.patterns = state.game.current.update(latest, state.patterns);
      // return makeResult(state, `@${context.username} (posing as @${fakeuser}): ${output}`);
      return makeResult(state, "");
    }
  ),
  // change the max active patterns
  new Command(
    "!maxpat",
    true,
    (state, context, message) => {
      state.maxActivePatterns = message.split(" ")[1];
      const output = `changed the maximum active patterns to ${state.maxActivePatterns}`
      return makeResult(state, `@${context.username}: ${output}`);
    }
  ),
  // change the current game
  new Command(
    "!game",
    true,
    (state, context, message) => {
      const title = message.split(" ")[1];
      state.game.changeTo(title);
      const output = `game changed to ${state.game.current.title}`;
      return makeResult(state, `@${context.username}: ${output}`);
    }
  ),
  // get link to tidal wiki
  new Command(
    "!wiki",
    false,
    (state, context, message) => {
      const output = "https://tidalcycles.org/";
      return makeResult(state, `@${context.username}: ${output}`);
    }
  ),
  // get link to git repo
  new Command(
    "!git",
    false,
    (state, context, message) => {
      const output = "https:github.com/isyuck/tidal-party";
      return makeResult(state, `@${context.username}: ${output}`);
    }
  ),
  // list these commands
  new Command(
    "!cmds",
    false,
    (state, context, message) => {
      let output = "available commands: [";
      for (let command of commands) {
        output = output.concat(`${command.cmd}, `);
      }
      output = output.slice(0, -2) + "]";
      return makeResult(state, `@${context.username}: ${output}`);
    }
  ),
);
