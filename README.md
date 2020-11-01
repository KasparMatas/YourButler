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
https://discordjs.guide/
https://discordjs.guide/commando/ OR https://dragonfire535.gitbooks.io/discord-js-commando-beginners-guide/content/getting-started.html

Both of the libraries have good documentation available at https://discord.js.org/#/docs/main/stable/general/welcome

The bot is run using node.js - also deals with the dependencies specified in "package.json"

To get inspiration the existing code and commits can be looked at (and the workflow to follow!) or other open source projects can be found on the interwebs: https://github.com/topics/discord-js-commando

### SQLite usage

To save settings after the bot being shutdown all of the data is stored using the Commando.Provider class to manipulate a SQLite database. The database itself is stored in the my_data.db file which can be viewed in various ways. (You can look it up!)

## Ideas not written down as issues yet
* Add player
* Remove player
* Make adding and removing user/mention based
* Add multiple mentioned players
* Aliases for games
* Emojis attached to games
* Register with reactions to a pinned message
* Create voice channel
* Create text channel
* Post pinned messages
* Move player to allocated server
* Shuffle current allocation again
* Attach roles with correct permissions.
* Swap
* Sitout round - Just chatting
* What am I registered for command
* Help command
* Music playing capabilities
* Muting/unmuting (important for AmongUs)

## How the evening could look like
1. The users get invited to a channel (Ideally created by the bot - based on some configuration)
2. Once joined the channel they should register in various ways
3. The users only see general/announcement/registration/introduction text channels and 1 general voice channel they can interact with
4. On the day registrations get confirmed by some sign-in mechanism.
5. Then after allocation guests see more channels (text & voice) for different teams and instructions (done with role with different permissions)

For ice breakers the bot can facilitate bunch of other sillyness

If everything is done perfectly the admins don't have to do anything and everything is automated by the bot. Kind of "just press next slide".