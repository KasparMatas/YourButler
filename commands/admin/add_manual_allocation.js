const { Command } = require('discord.js-commando');
const { generatePlayerProbabilities } = require('../../util');
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
                    type: 'member',
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
        const game_roles = provider.get(guild, 'game_roles', null);
        if (!game_roles) {
            return message.say('Roles haven\'t been setup yet!');
        }

        generatePlayerProbabilities(Object.keys(current_probabilities), player.id, message);

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

        Object.keys(game_roles).forEach(game_with_role => {
            player.roles.remove(game_roles[game_with_role]);
        });
        player.roles.add(game_roles[game]);

        return message.say(`${player.user.username} has been allocated to the ${game} lobby`);
    }
};