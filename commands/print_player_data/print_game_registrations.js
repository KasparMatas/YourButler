const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { getGameRegistrations } = require('../../util');
module.exports = class PrintGameRegistrationsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'print_game_registrations',
            group: 'print_player_data',
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

    run(message, { game_name }) {
        const game_registrations = getGameRegistrations(message);
        if (game_name == '') {
            const embed = new MessageEmbed()
                .setColor('#32a858')
                .setTitle('Game registration data');

            game_registrations.each((player_list, game) => {
                embed.addFields({ name: `${game} : ${player_list.length}`, value: player_list });
            });

            return message.channel.send(embed);
        }
        else if (game_registrations.has(game_name)) {
            return message.say(game_registrations.get(game_name));
        }
        else {
            return message.say('Game not found!');
        }
    }
};
