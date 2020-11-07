const { Command } = require('discord.js-commando');
const { Collection, MessageAttachment } = require('discord.js');
const { Readable } = require('stream');

module.exports = class ExportDataCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'export_data',
            group: 'print_allocation_stats',
            memberName: 'export_data',
            description: 'Command to export player probabilities',
            ownerOnly: true,
            guildOnly: true,
        });
    }

    run(message) {

        const provider = message.client.provider;
        const guild = message.guild;

        const registered_players = provider.get(guild, 'registered_players', null);

        if (registered_players == null) {
            return message.say('No registrations found!');
        }

        const player_registrations = new Collection();
        if (registered_players != null) {
            registered_players.forEach(player => {
                const game_list = provider.get(guild, player, null);
                if (game_list != null) {
                    player_registrations.set(player, game_list);
                }
            });
        }
        const export_data = new Object();

        player_registrations.each((probabilities, player) => {
            export_data[player] = probabilities;
        });

        return message.channel.send(new MessageAttachment(Readable.from(JSON.stringify(export_data)), 'export_data.json'))
            .catch(console.error);
    }
};
