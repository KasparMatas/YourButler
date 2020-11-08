const { Command } = require('discord.js-commando');
module.exports = class PrintChannelsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'print_channels',
            group: 'print_allocation_stats',
            memberName: 'print_channels',
            description: 'Command to print created channels',
            ownerOnly: true,
            guildOnly: true,
        });
    }

    async run(message) {
        const provider = message.client.provider;
        const guild = message.guild;

        const game_channels = provider.get(guild, 'game_channels', new Object());

        if (Object.keys(game_channels).length == 0) {
            return message.say('No channels found');
        }

        let response_string = '';

        Object.keys(game_channels).forEach(game => {
            const channel = guild.channels.cache.get(game_channels[game]);
            response_string += `${game}: "${channel.name}"\n`;
        });

        return message.say(response_string);
    }
};
