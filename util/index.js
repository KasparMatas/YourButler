const { Collection } = require('discord.js');

const pushToCollectionValueList = (collection, key, value) => {
    if (collection.has(key)) {
        const value_list = collection.get(key);
        if (!value_list.includes(value)) {
            value_list.push(value);
            collection.set(key, value_list);
        }
    }
    else {
        collection.set(key, [value]);
    }
};

const reverseCollection = (orignal_collection) => {
    const new_collection = new Collection();
    orignal_collection.each((value_array, key) => {
        value_array.forEach(value => {
            pushToCollectionValueList(new_collection, value, key);
        });
    });
    return new_collection;
};

const getGameRegistrations = (message) => {
    const provider = message.client.provider;
    const guild = message.guild;

    const available_games = provider.get(guild, 'available_games', null);
    if (available_games != null) {
        const game_registrations = new Collection();
        available_games.forEach(game => {
            const player_list = provider.get(guild, game, null);
            if (player_list != null) {
                game_registrations.set(game, player_list);
            }
        });
        return game_registrations;
    }
    else {
        return null;
    }
};

const getPlayerRegistrations = (message) => {
    const provider = message.client.provider;
    const guild = message.guild;

    const registered_players = provider.get(guild, 'registered_players', null);
    if (registered_players != null) {
        const player_registrations = new Collection();
        registered_players.forEach(player => {
            const game_list = provider.get(guild, player, null);
            if (game_list != null) {
                player_registrations.set(player, Object.keys(game_list));
            }
        });
        return player_registrations;
    }
    else {
        return null;
    }
};

exports.reverseCollection = reverseCollection;
exports.pushToCollectionValueList = pushToCollectionValueList;
exports.getPlayerRegistrations = getPlayerRegistrations;
exports.getGameRegistrations = getGameRegistrations;