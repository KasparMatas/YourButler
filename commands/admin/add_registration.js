const { Command } = require('discord.js-commando');
const { getGameRegistrations, reverseCollection, generatePlayerProbabilities, pushToCollectionValueList } = require('../../util');
module.exports = class AddRegistrationCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'add_registration',
            group: 'admin',
            memberName: 'add_registration',
            description: 'Command to add a game to a player\'s registration list',
            ownerOnly: true,
            guildOnly: true,
            args: [
                {
                    key: 'player',
                    prompt: 'Which player\'s registrations do you want extend?',
                    type: 'string',
                },
                {
                    key: 'game',
                    prompt: 'Which game do you want to add to the players list?',
                    type: 'string',
                },
            ],
        });
    }

    registerPlayerToGame(message, player, game) {
        const provider = message.client.provider;
        const guild = message.guild;

        const available_games = provider.get(guild, 'available_games', []);
        if (!available_games.includes(game)) {
            available_games.push(game);
            provider.set(guild, 'available_games', available_games);
        }

        const registered_players = provider.get(guild, 'registered_players', []);
        if (!registered_players.includes(player)) {
            registered_players.push(player);
            provider.set(guild, 'registered_players', registered_players);
        }

        const game_registrations = getGameRegistrations(message);
        if (game_registrations == null || !game_registrations.has(game)) {
            provider.set(guild, game, [player]);
            generatePlayerProbabilities([game], player, message);
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
    }

    run(message, { player, game }) {
        this.registerPlayerToGame(message, player, game);
        return message.say('Game successfully added.');
    }
};