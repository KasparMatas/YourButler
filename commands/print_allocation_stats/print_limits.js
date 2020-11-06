const { Command } = require('discord.js-commando');
module.exports = class PrintGameLimitsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'print_limits',
            group: 'print_allocation_stats',
            memberName: 'print_limits',
            description: 'Command to print game limits',
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
        const provider = message.client.provider;
        const guild = message.guild;

        const lobby_limits = provider.get(guild, 'lobby_limits', null);
        if (game_name == '' && lobby_limits != null) {
            let output_string = '';

            const available_games = provider.get(guild, 'available_games', null);

            if (available_games == null) {
                return message.say('No registrations!');
            }

            Object.keys(lobby_limits).forEach(game => {
                output_string += `${game} - MIN:${lobby_limits[game].min} MAX:${lobby_limits[game].max}\n`;
            });

            available_games.forEach(game => {
                if (!Object.keys(lobby_limits).includes(game)) {
                    output_string += `${game} - No limits set!\n`;
                }
            });

            message.say(output_string);
        }
        else if (lobby_limits != null && Object.keys(lobby_limits).includes(game_name)) {
            return message.say(`MIN:${lobby_limits[game_name].min} \n MAX:${lobby_limits[game_name].max}`);
        }
        else {
            return message.say('No limits set!');
        }
    }
};
