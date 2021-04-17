const config = require("./config.js");
const tmi = require("tmi.js");
const { spawn } = require("child_process");
const algorithms = require("./algorithms.js");

// the list of all active patterns
let patterns = [];

// twitch
const twitchClient = new tmi.client(config.twitch);
twitchClient.on("message", onMessageHandler);
twitchClient.on("connected", onConnectedHandler);
twitchClient.connect();

// tidal
const tidal = spawn("ghci", ["-ghci-script", config.ghci.path]);
tidal.stdout.on("data", (data) => {
  console.log(`tidal ${String(data).trim()}`);
});
tidal.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

function handleNewMessage(user, msg) {
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
    for ([i, p] of patterns.entries()) {
      tidal.stdin.write(`d${i + 1} \$ ${p.pattern}\n`);
    }

    console.log(patterns);
    return `@${user}: ${msg}`;
  } else {
    console.log(
      `no algorithm at index ${config.algorithm}, try a number less than ${algorithms.length}`
    );
  }
  return "";
}

function onMessageHandler(target, context, msg, self) {
  // ignore messages from the bot
  if (self) {
    return;
  }

  // get first 'word' (all chars until whitespace)
  const commandName = msg.split(" ")[0];
  let result = "";

  // helper that executes f if user is a moderator or the broadcaster, otherwise set result
  // to an error message
  function modMessage(f) {
    if (context.mod || context.badges.broadcaster) {
      result = f();
      return;
    }
    result = `@${context.username}, you cannot use this command because you are not a mod`;
  }

  switch (commandName) {
    case "!t":
      result = handleNewMessage(context.username, msg);
      break;
    case "!u":
      // username as argument (for multiuser debug/testing by mods only)
      // e.g. `!u kuhn msg` to pretend to be the user @kuhn
      modMessage(() => {
        const tmsg = msg.split(" ");
        const user = tmsg.splice(1, 1);
        return handleNewMessage(user.join(" "), tmsg.join(" "));
      });
      break;
  }

  if (result) {
    twitchClient.say(target, result);
  }
}

function onConnectedHandler(addr, port) {
  console.log(`connected on ${addr}:${port}`);
}
