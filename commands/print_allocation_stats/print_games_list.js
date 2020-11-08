const { Command } = require('discord.js-commando');
module.exports = class PrintGamesListCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'print_games_list',
            group: 'print_allocation_stats',
            memberName: 'print_games_list',
            description: 'Command to print all registered for games.',
            ownerOnly: true,
            guildOnly: true,
        });
    }

    run(message) {
        const provider = message.client.provider;
        const guild = message.guild;

        const available_games = provider.get(guild, 'available_games', new Object());
        if (Object.keys(available_games).length == 0) {
            return message.say('No games are available!');
        }
        let output_string = '';
        Object.keys(available_games).forEach(game => {
            output_string += `${game} : ${available_games[game]}\n`;
        });
        return message.say(output_string);
    }
};
