const path = require('path');
const Database = require('better-sqlite3');
const db = new Database('my_data.db');

const { CommandoClient, SyncSQLiteProvider } = require('discord.js-commando');
const { unregisterPlayerFromGame, registerPlayerToGame } = require('./util');

require('dotenv').config();
const {
    PREFIX,
    OWNERS,
    TOKEN,
    MESSAGE,
    CHANNEL,
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
        ['print_allocation_stats', 'printing commands to see the algorithm'],
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

// Hack to keep registration message in cache.
client.on('ready', () => {
    client.channels.cache.get(CHANNEL).messages.cache.get(MESSAGE);
});

client.on('messageReactionAdd', (reaction, user) => {
    const provider = client.provider;
    const guild = reaction.message.guild;

    if (provider.get(guild, 'listen_to_reactions', null)) {
        const registration_message_id = provider.get(guild, 'registration_message_id', null);
        const available_games = provider.get(guild, 'available_games', new Object());
        if (registration_message_id && registration_message_id == reaction.message.id && Object.keys(available_games).length != 0) {
            Object.entries(available_games).forEach(([game, emoji]) => {
                if (reaction.emoji.name == emoji) {
                    registerPlayerToGame(reaction.message, user.id, game);
                }
            });
        }
    }
});

client.on('messageReactionRemove', (reaction, user) => {
    const provider = client.provider;
    const guild = reaction.message.guild;

    if (provider.get(guild, 'listen_to_reactions', null)) {
        const registration_message_id = provider.get(guild, 'registration_message_id', null);
        const available_games = provider.get(guild, 'available_games', new Object());
        if (registration_message_id && registration_message_id == reaction.message.id && Object.keys(available_games).length != 0) {
            Object.entries(available_games).forEach(([game, emoji]) => {
                if (reaction.emoji.name == emoji) {
                    unregisterPlayerFromGame(reaction.message, user.id, game);
                }
            });
        }
    }
});

client.login(TOKEN);