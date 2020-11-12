const { Command } = require('discord.js-commando');
module.exports = class PrintLinkedGamesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'print_linked_games',
            group: 'print_allocation_stats',
            memberName: 'print_linked_games',
            description: 'Command to print all links between games.',
            ownerOnly: true,
            guildOnly: true,
        });
    }

    run(message) {
        const provider = message.client.provider;
        const guild = message.guild;

        const linked_games = provider.get(guild, 'linked_games', new Object());
        if (Object.keys(linked_games).length == 0) {
            return message.say('No links set!');
        }
        let output_string = '';
        Object.keys(linked_games).forEach(game => {
            output_string += `${game} & ${linked_games[game]}\n`;
        });
        return message.say(output_string);
    }
};
