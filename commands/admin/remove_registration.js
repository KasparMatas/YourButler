const { Command } = require('discord.js-commando');
const { getGameRegistrations, reverseCollection, generatePlayerProbabilities, removeElementFromArray, removeFromCollectionValueList } = require('../../util');
module.exports = class RemoveRegistrationCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'remove_registration',
            group: 'admin',
            memberName: 'remove_registration',
            description: 'Command to remove a game from a player\'s registration list',
            ownerOnly: true,
            guildOnly: true,
            args: [
                {
                    key: 'player',
                    prompt: 'Which player\'s registrations do you want change?',
                    type: 'string',
                },
                {
                    key: 'game',
                    prompt: 'Which game do you want to remove from the players list?',
                    type: 'string',
                },
            ],
        });
    }

    unregisterPlayerFromGame(message, player, game) {
        const provider = message.client.provider;
        const guild = message.guild;

        let registered_players = provider.get(guild, 'registered_players', []);

        const game_registrations = getGameRegistrations(message);
        if (game_registrations.has(game)) {
            let player_list = game_registrations.get(game);
            if (player_list.includes(player)) {
                player_list = removeElementFromArray(player_list, player);
                provider.set(guild, game, player_list);
                if (player_list.length == 0) {
                    game_registrations.delete(game);
                }
                else {
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
    }

    run(message, { player, game }) {
        this.unregisterPlayerFromGame(message, player, game);
        return message.say('Game successfully removed.');
    }
};