// client id guusv7otlopu3dlprk9tpoijs6hf4j

// let socket;
// var io = require('socket.io')(8081);
const osc = require('node-osc');
const oscClient = new osc.Client('127.0.0.1', 6060);
const tmi = require('tmi.js');
let connections = [];
const maxActiveConnections = 4;
const oscAddr = "/ctrl"

// Define twitch configuration options
const opts = {
  identity: {
    username: "tobtes", // test account
    password: "oauth:jnw6gcu3xw0okg91xfekw2w894vjh1",
  },
  channels: [
    "isyuck"
  ]
};

const commands = {
  about: "ctrlAV is an ecosystem for audiovisual performers and their audiences to try new things and brainstorm for a new tomorrow",
  today: "Kickoff Talk",
  commands: () => {
    return Object.keys(commands)
      .map((command) => " !" + command)
    },
  schedule: "The livestream schedule is 8-10pm EST (+5 UTC) on Thursdays, but the topics have not been decided yet",
  zork: "West of House This is an open field west of a white house, with a boarded front door. There is a small mailbox here. A rubber mat saying 'Welcome to Zork!' lies by the door.",
  osc: "sending osc message"
}

// Create a client with our options
const twitchClient = new tmi.client(opts);

// Register our event handlers (defined below)
twitchClient.on('message', onMessageHandler);
twitchClient.on('connected', onConnectedHandler);

// Connect to Twitch:
twitchClient.connect();

function handleOsc(msg, username) {

  if (msg === "!osc") { return "error: pattern empty, maybe try !osc \"bd sn cp hh\" ?" }

  if (msg === "silence") {

    for ([i, c] of connections.entries()) {
      if (c.username === username) {
        oscClient.send(oscAddr, "p" + i, "")
        return `silenced ${username}'s pattern`;
      }
    }

  } else {

    let current = ({pattern: "", effects:{name: "", pattern: ""}});

    // get the first pattern
    let match = msg.match(/"(.*?)"/)
    if (match) {
      current.pattern = match[1]
    } else {
      return ""
    }

    if (!current.pattern) { return "error: pattern empty, maybe try !osc \"bd sn cp hh\"" }

    if (msg.match(/#/g)) {
      const effectPairs = msg.split('# ')
      let effects = []
      effectPairs.shift() // remove first pattern
      for (pair of effectPairs) {
        pair = pair.split(' ')
        const name = pair.shift()
        const pat  = pair.join(" ").replace(/"/g, "")
        effects.push({name: name, pattern: pat})
      }
      current.effects = effects;
    }

    console.log(current)

    if (!connections.length) { 
      // if there are no connections just add the user's pattern
      connections.push({username: username, pattern: current.pattern, effects: current.effects})
    } else if (connections.length < maxActiveConnections){
      for (c of connections) {
        // if the user already has a connection
        if (c.username === username) {
          c.pattern = current.pattern
          c.effects = current.effects
        } else {
          connections.push({username: username, pattern: current.pattern, effects: current.effects})
        }
      }
    } else {
      // remove last sent connection and replace with the new one
      connections.push({username: username, pattern: current.pattern, effects: current.effects})
      connections.shift()
    }

  // update all connections
  for ([i, c] of connections.entries()) {
    c.index = i;
    oscClient.send(oscAddr, "p" + String(i), c.pattern)
    if (c.effects.length) {
      for (const e of c.effects) {
        oscClient.send(oscAddr, "p" + i + "-" + e.name, e.pattern)
      }
    }
  }
  console.log(connections)

  return `pattern "${current.pattern}" from ${username} sent`
  }
  return "";
}


// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // get first 'word' (all chars until whitespace)
  const commandName = msg.split(' ')[0]

  switch(commandName) {
    case '!today':
      twitchClient.say(target, `Today's topic is ${commands.today}`);
      console.log(`ran ${commandName}`);
      break;
    case '!commands':
      twitchClient.say(target, `Available commands are ${commands.commands()}`);
      console.log(`ran ${commandName}`);
      break;
    case '!about':
      twitchClient.say(target, commands.about);
      console.log(`ran ${commandName}`);
      break;
    case '!schedule':
      twitchClient.say(target, commands.schedule);
      console.log(`ran ${commandName}`);
      break;
    case '!zork':
      twitchClient.say(target, commands.zork);
      break;
    case "!osc":
      const result = handleOsc(msg.substr(msg.indexOf(" ") + 1), context.username);
      twitchClient.say(target, result);
      break;
    default:
      console.log("Not a recognized command");
  }
}
// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
