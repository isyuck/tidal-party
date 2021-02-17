// client id guusv7otlopu3dlprk9tpoijs6hf4j

// let socket;
// var io = require('socket.io')(8081);
const osc = require('node-osc');
const oscClient = new osc.Client('127.0.0.1', 6060);
const tmi = require('tmi.js');
const maxActiveConnections = 4;
const oscAddr = "/ctrl"
const effectsList = require("./effects.json")

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
}

// Create a client with our options
const twitchClient = new tmi.client(opts);

// Register our event handlers (defined below)
twitchClient.on('message', onMessageHandler);
twitchClient.on('connected', onConnectedHandler);

// Connect to Twitch:
twitchClient.connect();

let connections = []

function parseMessage(msg) {
  let current = ({pattern: "", effects:{name: "", pattern: ""}});

  let match = msg.match(/"(.*?)"/)
  current.pattern = match[1]

  const effectPairs = msg.split('# ')
  let effects = []
  effectPairs.shift() // remove first pattern
  for (pair of effectPairs) {
    pair = pair.split(' ')
    const name = pair.shift()
    const pat = pair.join(" ").replace(/"/g, "").trim()
    effects.push({name: name, pattern: pat})
  }
  current.effects = effects;

  return current
}

function handleNewMessage(msg, username) {


  try {
    // common messages
       // empty
    if (msg === "!t" || msg === "" || msg === " " || msg === "\"\"" || !msg) { return `error: pattern from ${username} empty, maybe try !t \"bd sn cp hh\" ?` }
       // single quote
    if (msg === "\"") { return `error: could not parse pattern ${msg} from ${username}` }
       // help
    if (msg === "help") {return `usage: !t \"pattern\" | example: !t \"bd sn cp hh\" | !osc silence`}

       // silence user's pattern
    console.log(msg)
    if (msg === "silence") {
      for ([i, connection] of connections.entries()) {
        if (connection.user === username) {
          oscClient.send(oscAddr, "p" + i, "")
          connections.splice(i, 1)
          return `silenced ${username}'s pattern`;
        }
      }
    }

    // replace other double quotes with ""
    msg = msg.replace(/”|“/g, "\"") //

    const parsed = parseMessage(msg)
    let current = ({user: username, pattern: parsed.pattern, effects: parsed.effects})

    if (connections.length === 0) { 
      // if there are no connections just add the new connection
      connections.push(current)
    } else if (connections.length < maxActiveConnections){
      let match = false;
      for (connection of connections) {
        // if the user already has a connection
        if (connection.user === current.user) {
          Object.assign(connection, current)
          match = true;
          break;
        }
      }
      if (!match) { connections.push(current) }
    } else if (connections.length === maxActiveConnections) {
      // remove last sent connection and replace with the new one
      connections.push(current)
      connections.shift()
    }

    // prep osc messages
    let messages = []
    for ([i, connection] of connections.entries()) {
      let patternMsg = new osc.Message(oscAddr) // for 's'
      patternMsg.append(`p${i}`)
      patternMsg.append(connection.pattern)

      // update local effects list with values from connection
      let localEffectsList = JSON.parse(JSON.stringify(effectsList))
      for (listEffect of localEffectsList) {
        for (const connectionEffect of connection.effects) {
          if (connectionEffect.name === listEffect.name) {
            listEffect.pattern = connectionEffect.pattern
          }
        }
      }

      let effectMsgs = []

      for (const listEffect of localEffectsList) {
        let effectMsg = new osc.Message(oscAddr)  // for gain, speed etc
        effectMsg.append(`p${i}-${listEffect.name}`)
        effectMsg.append(listEffect.pattern)
        effectMsgs.push(effectMsg)
      }

      messages.push({pattern: patternMsg, effects: effectMsgs})
    }


    // send osc messages
    for (const message of messages) {
      oscClient.send(message.pattern ,() => {});
      if (message.effects.length) {
        for (const me of message.effects)
        oscClient.send(me, () => {});
      }
    }

    console.clear()
    console.log(`active patterns ${connections.length}`)
    for ([i, connection] of connections.entries()) {
      console.log(i, connection)
    }

    return `pattern "${current.pattern}" from ${current.user} sent`
  } catch (err) {
    console.log(err)
    return `${err.name} in message from ${username}, try checking your syntax?`
  }

  try {
    return `unknown error! try checking your syntax, ${username}`
  } catch (err) {
    return `unknown error! check your syntax?`
  }
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
    case "!t":
      const result = handleNewMessage(msg.substr(msg.indexOf(" ") + 1), context.username);
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
