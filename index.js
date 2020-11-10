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

const reaction_message_check = () => {
    if (MESSAGE && CHANNEL) {
        client.channels.fetch(CHANNEL).then(() => client.channels.cache.get(CHANNEL).messages.fetch(MESSAGE).catch(console.error));
        if (client.channels.cache.has(CHANNEL) && client.channels.cache.get(CHANNEL).messages.cache.has(MESSAGE)) {
            client.user.setActivity('Registrations', { type: 'WATCHING' }).then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
                .catch(console.error);
        }
        else {
            client.user.setActivity('Sweet dreams', { type: 'WATCHING' }).then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
                .catch(console.error);
        }
    }
};

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    console.log('Available guilds:');
    client.guilds.cache.each(guild => {
        console.log(`${guild.name}(${guild.id})`);
    });
    // Hack to keep registration message in cache.
    client.setInterval(reaction_message_check, 1800000);
});

client.on('error', console.error);

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