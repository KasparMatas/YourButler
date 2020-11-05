# YourButler
This repo is for a Discord bot built with the discord.js and discord.js-commando libraries. 

## Main idea
The main purpose of this bot is to matchmake discord users to different games. Which means that the bot must:
1. Register players to games
2. Allocate players randomly to voice channels dedicated to a specific game
3. Then new allocations can be generated such that players won't play the same game again
4. The allocations must be valid and fun (No 2 players playing a game meant to be played with 10) 

## Contributing
The base of the bot has been created and you are free to add whatever you want. (Just don't break anything and don't create crazy merge conflicts!)

To start contributing it is recommended to understand the following material:
* [Base discordjs guide](https://discordjs.guide/)
* [Base discordjs commando guide](https://discordjs.guide/commando/) OR [Similar custom discordjs commando guide](https://dragonfire535.gitbooks.io/discord-js-commando-beginners-guide/content/getting-started.html)

Both of the libraries have good documentation available [here](https://discord.js.org/#/docs/main/stable/general/welcome).

### How to run
Step by step instructions to run the bot can be seen in the [Wiki](https://github.com/KasparMatas/YourButler/wiki)!

The bot is run using **node.js** - also deals with the dependencies specified in *package.json*. The GitHub token should be stored in a *.env* file which use is described [here](https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/other-guides/env-files.md).

### SQLite usage

To save settings after the bot being shutdown all of the data is stored using the *Commando.Provider* class to manipulate a **SQLite** database. The database itself is stored in the *my_data.db* file which can be viewed in various ways. (You can look it up! I use [DB Browser](https://sqlitebrowser.org/))

## How the evening could look like
Below you can find the short version. For a longer discussion check out the [Wiki](https://github.com/KasparMatas/YourButler/wiki)!

1. The users get invited to a channel (Ideally created by the bot - based on some configuration).
2. Once joined the channel they should register in various ways.
3. The users only see general/announcement/registration/introduction text channels and 1 general voice channel they can interact with.
4. On the day registrations get confirmed by some sign-in mechanism.
5. Then after allocation guests see more channels (text & voice) for different teams and instructions (done with role with different permissions).

For ice breakers the bot can facilitate bunch of other sillyness

If everything is done perfectly the admins don't have to do anything and everything is automated by the bot. Kind of "just press next slide".

To get inspiration the existing code and commits can be looked at (and the workflow to follow!) or other open source projects can be found on the [interwebs](https://github.com/topics/discord-js-commando).