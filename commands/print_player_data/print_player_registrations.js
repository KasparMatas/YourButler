const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { getPlayerRegistrations } = require('../../util');
module.exports = class PrintPlayerRegistrationsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'print_player_registrations',
            group: 'print_player_data',
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
        if (player_name == '') {
            const embed = new MessageEmbed()
                .setColor('#32a858')
                .setTitle('Player registration data');

            player_registrations.each((game_list, player) => {
                embed.addFields({ name: player, value: game_list });
            });

            return message.channel.send(embed);
        }
        else if (player_registrations.has(player_name)) {
            return message.say(player_registrations.get(player_name));
        }
        else {
            return message.say('Player not found!');
        }
    }
};