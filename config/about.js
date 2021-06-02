module.exports =
  `tidal-party is an experiment in collaborative music and game design.

It provides an interface to TidalCyles, a live coding environment and pattern language for musical composition and improvisation, from twitch.tv chat.

To send a message to Tidal, type {inverse}!t s "bd cp hh sn"{/inverse} in the chat, and press enter.

The {bold}bd{/bold} is a bass drum, the {bold}cp{/bold} is a clap, the {bold}hh{/bold} is a hihat, and the {bold}sn{/bold} is a snare.

Some ideas for patterns:

{inverse}s "bd*4 cp*4"{/inverse}, {inverse}s "[sn hh]*2"{/inverse}, {inverse}s "hh(5,8)"{/inverse}, {inverse}s "[cp bd hh sn]/2"{/inverse}.

More information about TidalCyles and how to use it can be found on its wiki, type {inverse}!wiki{/inverse} for a link.

In tidal-party, patterns are usually only active for a few cycles before they expire! You can view the currently active patterns and their authors on the left.

tidal-party also introduces a number of games, the description and rules for the current game can be viewed under the patterns box.

More information about usage, games, pattern handling, and source code can be found on the tidal-party GitHub, type {inverse}!git{/inverse} for a link.

View all available commands with {inverse}!cmds{/inverse}.

`
