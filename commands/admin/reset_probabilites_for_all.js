const { Command } = require('discord.js-commando');
const { getGameRegistrations, getPlayerRegistrations } = require('../../util');
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

    getReversePopularityProbabilities(game_registrations, game_list) {
        const reverse_popularity_probabilities = new Object();
        const player_sum = this.getPlayerSum(game_registrations, game_list);
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
    }


    getPlayerSum(game_registrations, game_list) {
        let player_sum = 0;
        game_list.forEach(game => {
            player_sum += game_registrations.get(game).length;
        });
        return player_sum;
    }

    run(message) {
        const provider = message.client.provider;
        const guild = message.guild;

        const game_registrations = getGameRegistrations(message);
        if (game_registrations == null) {
            return message.say('Sorry no registrations found!');
        }
        const player_registrations = getPlayerRegistrations(message);

        player_registrations.each((game_list, player) => {
            const player_game_probabilities = new Object();
            const base_probability = 1 / game_list.length;
            const reverse_popularity_probabilities = this.getReversePopularityProbabilities(game_registrations, game_list);
            game_list.forEach(game => {
                const base_weight = 0.3;
                const popularity_weight = 0.7;
                player_game_probabilities[game] = (base_probability * base_weight) + (reverse_popularity_probabilities[game] * popularity_weight);
            });
            provider.set(guild, player, player_game_probabilities);
            // console.log(player, player_game_probabilities);
        });

        return message.say('Probabilities successfully reset');
    }
};