const path = require('path');
const Database = require('better-sqlite3');
const db = new Database('my_data.db');

const { CommandoClient, SyncSQLiteProvider } = require('discord.js-commando');

require('dotenv').config();
const {
    PREFIX,
    OWNERS,
    TOKEN,
} = process.env;

const client = new CommandoClient({
    commandPrefix: PREFIX,
    owner: OWNERS,
});

client.setProvider(new SyncSQLiteProvider(db)).then(() => {
    const saved_owners = client.provider.get('global', 'owner_id_list', null);
    if (saved_owners) {
        client.options.owner = saved_owners;
    }
}).catch(console.error);

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['admin', 'hidden commands'],
        ['games', 'acquired commands'],
        ['guest', 'available commands'],
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'))
    // Remove later
    .registerDefaultGroups()
    .registerDefaultCommands();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    console.log('Available guilds:');
    client.guilds.cache.each(guild => {
        console.log(`${guild.name}(${guild.id})`);
    });
});

client.on('error', console.error);

client.login("NzczNjMzMjQ3MjY2NzM0MDgw.X6MEGw.yaIL50qpjmNmkaiH_PL5Uu92KDU");