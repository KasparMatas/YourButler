const { Command } = require('discord.js-commando');
const { getGameRegistrations, getPlayerRegistrations, generatePlayerProbabilities } = require('../../util');
// Very similar to the the single player probabilites reset but a different command on purpose to prevent accidental resets.
module.exports = class ResetProbabilitesForAllCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reset_probabilities_for_all',
            group: 'admin',
            memberName: 'reset_probabilities_for_all',
            description: 'Command to reset the probabilities for all registered players such that less popular games are more likely to get populated',
            ownerOnly: true,
            guildOnly: true,
        });
    }

    run(message) {
        const game_registrations = getGameRegistrations(message);
        if (game_registrations == null) {
            return message.say('Sorry no registrations found!');
        }
        const player_registrations = getPlayerRegistrations(message);

        player_registrations.each((game_list, player) => {
            generatePlayerProbabilities(game_list, player, message);
        });

        return message.say('Probabilities successfully reset');
    }
};