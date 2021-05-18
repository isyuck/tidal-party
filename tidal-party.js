const config = require("./config.js");
const tmi = require("tmi.js");
const { spawn } = require("child_process");
const algorithms = require("./algorithms.js");

// the list of all active patterns
let patterns = [];

// the group structure
let groups = {};


// twitch
const twitchClient = new tmi.client(config.twitch);
twitchClient.on("message", onMessageHandler);
twitchClient.on("connected", onConnectedHandler);
twitchClient.connect();

// make sure you have safe-tidal-cli installed
// , ["-ghci-script", config.ghci.path]
const tidal = spawn("ghci", ["-ghci-script", config.ghci.path]);
tidal.stdout.on("data", (data) => {
  console.log(`tidal ${String(data).trim()}`);
});
tidal.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

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

    // send patterns to tidal
    if (config.expiration != 0) {
      for ([i, p] of patterns.entries()) {
        console.log("mortal")
        tidal.stdin.write(`mortal ${i + 1} ${config.expiration} 1 \$ ${p.pattern}\n`);
        //tidal.stdin.write(`d1 \$ ${p.pattern}\n`)
      }
    } else {
      for ([i, p] of patterns.entries()) {
        console.log("jumpin")
        // jumpin is a transition and will play the previous pattern before
        //jumping to the new pattern
        tidal.stdin.write(`jumpIn' ${i + 1} 1 \$ ${p.pattern}\n`);
      }
    }


    console.log(patterns);
    return `@${user}: ${msg}`;
  } else {
    return `no algorithm at index ${config.algorithm}, try a number less than ${algorithms.length}`;
  }
  return "";
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
      result =  `You can check your Latency to Broadcaster and Latency Mode (along with a number of other stats) by toggling Video Stats under the Advanced menu on the Settings icon on the bottom right hand corner of the video player.`
      break;
    case "!about":
      result =  "https://github.com/isyuck/twitch-tidal";
      break;
    //help if user wants to know the available commands
    case "!expire":
      modcmd(() => {
        if(splitmsg[1] >= 0) config.expiration = splitmsg[1];
        console.log(config.expiration)
        reset(target);
        return `@${context.username} changed the expiration to ${config.expiration}`
      });
      break;
    case "!group":

      if(!splitmsg[1]) {
        result = `@${context.username} please specify a group name.`
        break;
      }
      groups[context.username] = splitmsg[1];
      result = `@${context.username} joined group ${splitmsg[1]}`;
      console.log(groups)
      break;
    case "!discord":
      result = "https://discord.gg/2B6MUbBNvN";
      break;
    case "!commandlist":
      result = "Available commands are !t, !about, !latency, !group, !discord";
      break;
  }

  twitchClient.say(target, result);
}

function onConnectedHandler(addr, port) {
  console.log(`connected on ${addr}:${port}`);
}

function reset(target) {
  //both of these mess it up and I don't know why
  // tidal.stdin.write("hush\n");
  // for ([i, p] of patterns.entries()) {
  //   tidal.stdin.write(`d${i+1} $ silence\n`);
  // }
  patterns = [];
  twitchClient.say(target, "hold the phone, twitch-tidal has been reset");
}
