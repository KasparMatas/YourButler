const { Command } = require('discord.js-commando');
const { getGameRegistrations, getPlayerRegistrations, generatePlayerProbabilities } = require('../../util');
module.exports = class ResetPlayerProbabilitesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reset_player_probabilities',
            group: 'admin',
            memberName: 'reset_player_probabilities',
            description: 'Command to reset probabilities of the specified user.',
            ownerOnly: true,
            guildOnly: true,
            args: [
                {
                    key: 'player',
                    prompt: 'Which players probabilities do you want to reset?',
                    type: 'user',
                },
            ],
        });
    }

    run(message, { player }) {
        console.log(player);
        const game_registrations = getGameRegistrations(message);
        if (game_registrations == null) {
            return message.say('Sorry no registrations found!');
        }
        const player_registrations = getPlayerRegistrations(message);
        if (!player_registrations.has(player.id)) {
            return message.say('Sorry the specified player does not have any registrations!');
        }

        const game_list = player_registrations.get(player.id);
        generatePlayerProbabilities(game_list, player.id, message);
        return message.say(`Probabilities have been reset for ${player.username}`);
    }
};