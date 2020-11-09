const { Command } = require('discord.js-commando');
const { getPlayerRegistrations } = require('../../util');
module.exports = class PrintPlayerRegistrationsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'print_player_registrations',
            group: 'print_allocation_stats',
            memberName: 'print_player_registrations',
            description: 'Command to print player registrations',
            ownerOnly: true,
            guildOnly: true,
            args: [
                {
                    key: 'player',
                    prompt: 'Which player registrations do you want to see?',
                    type: 'user',
                    default: '',
                },
            ],
        });
    }

    async run(message, { player }) {
        const player_registrations = getPlayerRegistrations(message);
        if (player_registrations == null) {
            return message.say('No registrations found!');
        }
        else if (player == '') {
            await message.guild.members.fetch({ user: player_registrations.keyArray() });
            let output_string = '';

            player_registrations.each((game_list, player_id) => {
                output_string += `**${message.guild.members.cache.get(player_id).user.username}**:\n`;
                output_string += `${game_list}\n`;
            });

            return message.say(output_string);
        }
        else if (player_registrations.has(player.id)) {
            return message.say(player_registrations.get(player.id));
        }
        else {
            return message.say('Player not found!');
        }
    }
};
