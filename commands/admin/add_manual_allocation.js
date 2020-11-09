const { Command } = require('discord.js-commando');
// const { ResetPlayerProbabilitesCommand } = require('./reset_player_probabilities.js');
module.exports = class AddManualAllocationCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'add_manual_allocation',
            group: 'admin',
            memberName: 'add_manual_allocation',
            description: 'Command to allocate a player',
            ownerOnly: true,
            guildOnly: true,
            args: [
                {
                    key: 'player',
                    prompt: 'Which player do you want to allocate?',
                    type: 'user',
                },
                {
                    key: 'game',
                    prompt: 'To which game do you want to allocate the player to?',
                    type: 'string',
                },
            ],
        });
    }

    run(message, { player, game }) {
        const provider = message.client.provider;
        const guild = message.guild;
        const current_probabilities = provider.get(guild, player.id, null);
        if (current_probabilities == null) {
            return message.say('Sorry the player isn\'t registered for anything yet.');
        }
        else if (!Object.keys(current_probabilities).includes(game)) {
            return message.say(`Sorry the player isn't registered to play ${game}`);
        }

        message.client.registry.commands.get('reset_player_probabilities').run(message, player);

        if (current_probabilities != null) {
            const game_list = Object.keys(current_probabilities);
            if (game_list.length != 1) {
                const current_game_value = current_probabilities[game];
                const other_games_update_value = current_game_value / (game_list.length - 1);

                game_list.forEach(potential_next_game => {
                    current_probabilities[potential_next_game] += other_games_update_value;
                });
                current_probabilities[game] = 0;

                provider.set(guild, player.id, current_probabilities);
            }
        }

        return message.say(`${player.username} has been allocated to the ${game} lobby`);
    }
};