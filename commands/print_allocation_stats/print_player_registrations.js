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
                    key: 'player_name',
                    prompt: 'Which player registrations do you want to see?',
                    type: 'string',
                    default: '',
                },
            ],
        });
    }

    run(message, { player_name }) {
        const player_registrations = getPlayerRegistrations(message);
        if (player_registrations == null) {
            return message.say('No registrations found!');
        }
        else if (player_name == '') {
            let output_string = '';

            player_registrations.each((game_list, player) => {
                output_string += `**${player}**:\n`;
                output_string += `${game_list}\n`;
            });

            return message.say(output_string);
        }
        else if (player_registrations.has(player_name)) {
            return message.say(player_registrations.get(player_name));
        }
        else {
            return message.say('Player not found!');
        }
    }
};
