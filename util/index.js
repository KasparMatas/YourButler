const { Collection } = require('discord.js');

const arraysAreEqual = (first_array, second_array) => {
    const second_array_sorted = second_array.slice().sort();
    return first_array.length === second_array.length && first_array.slice().sort().every((value, index) => {
        return value === second_array_sorted[index];
    });
};

const removeElementFromArray = (array, element_to_remove) => {
    return array.filter(existing_element => existing_element !== element_to_remove);
};

const removeFromCollectionValueList = (collection, key, value) => {
    if (collection.has(key)) {
        let value_list = collection.get(key);
        if (value_list.includes(value)) {
            value_list = removeElementFromArray(value_list, value);
            collection.set(key, value_list);
        }
    }
};

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

    const available_games = provider.get(guild, 'available_games', new Object());
    if (Object.keys(available_games).length != 0) {
        let game_added = false;
        const game_registrations = new Collection();
        Object.keys(available_games).forEach(game => {
            const player_list = provider.get(guild, game, null);
            if (player_list) {
                game_added = true;
                game_registrations.set(game, player_list);
            }
        });
        if (game_added) {
            return game_registrations;
        }
        else {
            return null;
        }
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

const getRegistrationsCount = (game_registrations) => {
    let player_sum = 0;
    game_registrations.each((player_list) => {
        player_sum += player_list.length;
    });
    return player_sum;
};

const getReversePopularityProbabilities = (game_registrations, game_list) => {
    const reverse_popularity_probabilities = new Object();
    const player_sum = getRegistrationsCount(game_registrations);
    let sum_of_probabilities = 0;
    game_list.forEach(game => {
        reverse_popularity_probabilities[game] = 1 - (game_registrations.get(game).length / player_sum);
        sum_of_probabilities += reverse_popularity_probabilities[game];
    });
    // Normalise
    game_list.forEach(game => {
        reverse_popularity_probabilities[game] = reverse_popularity_probabilities[game] / sum_of_probabilities;
    });
    return reverse_popularity_probabilities;
};

const generatePlayerProbabilities = (game_list, player, message) => {

    const provider = message.client.provider;
    const guild = message.guild;

    const game_registrations = getGameRegistrations(message);

    const player_game_probabilities = new Object();
    const base_probability = 1 / game_list.length;
    const reverse_popularity_probabilities = getReversePopularityProbabilities(game_registrations, game_list);
    game_list.forEach(game => {
        const base_weight = 0.2;
        const popularity_weight = 0.8;
        player_game_probabilities[game] = (base_probability * base_weight) + (reverse_popularity_probabilities[game] * popularity_weight);
    });
    provider.set(guild, player, player_game_probabilities);
};

const registerPlayerToGame = (message, player, game) => {
    const provider = message.client.provider;
    const guild = message.guild;

    const available_games = provider.get(guild, 'available_games', new Object());
    if (!Object.keys(available_games).includes(game)) {
        return;
    }

    const registered_players = provider.get(guild, 'registered_players', []);
    if (!registered_players.includes(player)) {
        registered_players.push(player);
        provider.set(guild, 'registered_players', registered_players);
    }

    let game_registrations = getGameRegistrations(message);
    if (!game_registrations) {
        game_registrations = new Collection();
    }
    if (!game_registrations.has(game)) {
        provider.set(guild, game, [player]);
        game_registrations.set(game, [player]);
        const player_registrations = reverseCollection(game_registrations);
        generatePlayerProbabilities(player_registrations.get(player), player, message);
    }
    else {
        const player_list = game_registrations.get(game);
        if (!player_list.includes(player)) {
            player_list.push(player);
            provider.set(guild, game, player_list);
            pushToCollectionValueList(game_registrations, game, player);
            const player_registrations = reverseCollection(game_registrations);
            generatePlayerProbabilities(player_registrations.get(player), player, message);
        }
    }
};

const unregisterPlayerFromGame = (message, player, game) => {
    const provider = message.client.provider;
    const guild = message.guild;

    let registered_players = provider.get(guild, 'registered_players', []);

    const game_registrations = getGameRegistrations(message);
    if (game_registrations && game_registrations.has(game)) {
        let player_list = game_registrations.get(game);
        if (player_list.includes(player)) {
            player_list = removeElementFromArray(player_list, player);
            if (player_list.length == 0) {
                provider.remove(guild, game);
                game_registrations.delete(game);
            }
            else {
                provider.set(guild, game, player_list);
                removeFromCollectionValueList(game_registrations, game, player);
            }
            const player_registrations = reverseCollection(game_registrations);
            if (player_registrations.has(player)) {
                generatePlayerProbabilities(player_registrations.get(player), player, message);
            }
            else {
                registered_players = removeElementFromArray(registered_players, player);
                provider.set(guild, 'registered_players', registered_players);
            }
        }
    }
};

exports.reverseCollection = reverseCollection;
exports.pushToCollectionValueList = pushToCollectionValueList;
exports.getPlayerRegistrations = getPlayerRegistrations;
exports.getGameRegistrations = getGameRegistrations;
exports.generatePlayerProbabilities = generatePlayerProbabilities;
exports.removeElementFromArray = removeElementFromArray;
exports.removeFromCollectionValueList = removeFromCollectionValueList;
exports.arraysAreEqual = arraysAreEqual;
exports.registerPlayerToGame = registerPlayerToGame;
exports.unregisterPlayerFromGame = unregisterPlayerFromGame;