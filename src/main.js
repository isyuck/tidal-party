// local
import config from "../config/config.js";
import algorithms from "./algorithms.js";
import * as twitch from "./twitch.js";
import * as tidal from "./tidal.js";
import * as ui from "./ui.js";

export function run() {

  // the list of all active patterns
  let patterns = [];
  // the group structure
  let groups = {};

  // connect to twitch and start tidal
  twitch.connect();
  tidal.start();
  ui.render();
  // ref the fn that is called when a message is received
  twitch.onMessage(onMessageHandler);

  function handlePattern(user, msg) {
    // parse twitch message into object
    const latest = {
      user: user,
      pattern: (msg = msg.substr(msg.indexOf(" ") + 1)),
    };

    // don't use an algo that doesn't exist
    if (config.algorithm < algorithms.length) {
      // use an algorithm to update the list of active patterns
      patterns = algorithms[config.algorithm](
        latest,
        patterns,
        config.maxActivePatterns
      );

      // create a string to prepend to each pattern. `X` gets
      // replaced by the position of the pattern in the list,
      // e.g. for the fourth pattern X = 4
      const prepend = (config.expiration != 0)
        ? `mortal X ${config.expiration} 1`
        : `jumpIn' X 1`;

      // send patterns to tidal
      tidal.writePatterns(patterns, prepend);

      console.log(patterns);
      return `@${user}: ${msg}`;
    } else {
      return `no algorithm at index ${config.algorithm}, try a number less than ${algorithms.length}`;
    }
  }

  function onMessageHandler(target, context, msg, self) {
    // ignore messages from the bot
    if (self) {
      return;
    }

    let result = "";
    const splitmsg = msg.split(" ");

    // helper that executes f if user is a moderator or the broadcaster, otherwise set result
    // to an error message
    function modcmd(f) {
      if (context.mod || context.badges.broadcaster) {
        result = f();
        return;
      }
      result = `@${context.username}, you cannot use this command because you are not a mod`;
    }

    switch (splitmsg[0]) {
      case "!t":
        // handle a tidal pattern
        result = handlePattern(context.username, msg);
        break;
      case "!u":
        // same as !t but with username as argument (for multiuser debug/testing by mods only)
        // e.g. `!u kuhn msg` to pretend to be the user @kuhn
        modcmd(() => {
          const user = splitmsg.splice(1, 1);
          return handlePattern(user.join(" "), splitmsg.join(" "));
        });
        break;
      case "!maxpat":
        // change the max active patterns
        modcmd(() => {
          config.maxActivePatterns = splitmsg[1];
          return `@${context.username} changed the maximum active patterns to ${config.maxActivePatterns}`;
        });
        break;
      case "!algo":
        // switch the current algorithm
        modcmd(() => {
          config.algorithm = splitmsg[1];
          return `@${context.username} switched to algorithm[${config.algorithm}]`;
        });
        break;
      //help if user wants to check latency
      case "!latency":
        result = `You can check your Latency to Broadcaster and Latency Mode (along with a number of other stats) by toggling Video Stats under the Advanced menu on the Settings icon on the bottom right hand corner of the video player.`;
        break;
      case "!about":
        result = "https://github.com/isyuck/tidal-party";
        break;
      //help if user wants to know the available commands
      case "!expire":
        modcmd(() => {
          if (splitmsg[1] >= 0) config.expiration = splitmsg[1];
          console.log(config.expiration);
          reset(target);
          return `@${context.username} changed the expiration to ${config.expiration}`;
        });
        break;
      case "!group":
        if (!splitmsg[1]) {
          result = `@${context.username} please specify a group name.`;
          break;
        }
        groups[context.username] = splitmsg[1];
        result = `@${context.username} joined group ${splitmsg[1]}`;
        console.log(groups);
        break;
      case "!discord":
        result = "https://discord.gg/2B6MUbBNvN";
        break;
      case "!commandlist":
        result = "Available commands are !t, !about, !latency, !group, !discord";
        break;
    }

    twitch.say(target, result);
  }

  function reset(target) {
    // TODO hush
    patterns = [];
    twitch.say(target, "hold the phone, twitch-tidal has been reset");
  }
}
