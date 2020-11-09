const { Command } = require('discord.js-commando');
const { getGameRegistrations } = require('../../util');
module.exports = class PrintGameRegistrationsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'print_game_registrations',
            group: 'print_allocation_stats',
            memberName: 'print_game_registrations',
            description: 'Command to print game registrations',
            ownerOnly: true,
            guildOnly: true,
            args: [
                {
                    key: 'game_name',
                    prompt: 'Which game registrations do you want to see?',
                    type: 'string',
                    default: '',
                },
            ],
        });
    }

    async run(message, { game_name }) {
        const game_registrations = getGameRegistrations(message);
        if (game_registrations == null) {
            return message.say('No registrations found!');
        }
        else if (game_name == '') {
            await message.guild.members.fetch({ user: message.client.provider.get(message.guild, 'registered_players') });
            let output_string = '';

            game_registrations.each((player_id_list, game) => {
                const player_list = [];
                player_id_list.forEach(player_id => {
                    const player = message.guild.members.cache.get(player_id);
                    console.log(player);
                    player_list.push(player.user.username);
                });
                output_string += `**${game}** : ${player_list.length}\n${player_list}\n`;
            });

            return message.say(output_string);
        }
        else if (game_registrations != null) {
            return message.say(game_registrations.get(game_name));
        }
        else {
            return message.say('Game not found!');
        }
    }
};
