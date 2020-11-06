const { Command } = require('discord.js-commando');
const { getGameRegistrations, getPlayerRegistrations } = require('../../util');
// Pretty much copy paste of reset_for_all. Yes I am too lazy to refactor against code duplication.
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
                    key: 'player_name',
                    prompt: 'Which players probabilities do you want to reset?',
                    type: 'string',
                },
            ],
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

    run(message, { player_name }) {
        const provider = message.client.provider;
        const guild = message.guild;

        const game_registrations = getGameRegistrations(message);
        if (game_registrations == null) {
            return message.say('Sorry no registrations found!');
        }
        const player_registrations = getPlayerRegistrations(message);
        if (player_registrations.has(player_name)) {
            return message.say('Sorry the specified player does not have any registrations!');
        }

        const game_list = player_registrations.get(player_name);
        const player_game_probabilities = new Object();
        const base_probability = 1 / game_list.length;
        const reverse_popularity_probabilities = this.getReversePopularityProbabilities(game_registrations, game_list);
        game_list.forEach(game => {
            const base_weight = 0.3;
            const popularity_weight = 0.7;
            player_game_probabilities[game] = (base_probability * base_weight) + (reverse_popularity_probabilities[game] * popularity_weight);
        });
        provider.set(guild, player_name, player_game_probabilities);
        // console.log(player_name, player_game_probabilities);
    }
};