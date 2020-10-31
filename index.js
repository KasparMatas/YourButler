const path = require('path');
const Database = require('better-sqlite3')
const db = new Database('settings.db')

const { CommandoClient, SyncSQLiteProvider } = require('discord.js-commando');
const { Discord } = require('discord.js');

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

client.setProvider(new SyncSQLiteProvider(db)).catch(console.error);

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
    console.log(`Available guilds:`);
    client.guilds.cache.each(guild => {
        console.log(`${guild.name}(${guild.id})`);
    });
});

client.on('error', console.error);

client.login(TOKEN);