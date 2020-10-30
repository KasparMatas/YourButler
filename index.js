const { CommandoClient } = require('discord.js-commando');
const { Discord } = require('discord.js');
const path = require('path');

require('dotenv').config();
const {
    PREFIX,
    OWNERS,
    TOKEN
} = process.env

const client = new CommandoClient({
    commandPrefix: PREFIX,
    owner: OWNERS,
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['admin', 'owner only commands'],
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'))
    // Remove later
    .registerDefaultGroups()
    .registerDefaultCommands();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
});

client.on('error', console.error);

client.login(TOKEN);