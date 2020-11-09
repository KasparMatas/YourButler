const { Command } = require('discord.js-commando');
module.exports = class PrintRegistrationMessageIDCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'print_registration_message_id',
            group: 'print_allocation_stats',
            memberName: 'print_registration_message_id',
            description: 'Command to print registration message id',
            ownerOnly: true,
            guildOnly: true,
        });
    }

    run(message) {
        const provider = message.client.provider;
        const guild = message.guild;

        const message_id = provider.get(guild, 'registration_message_id', 'Not set');
        const channel_id = provider.get(guild, 'registration_message_channel_id', 'Not set');

        return message.say(`The message id: ${message_id}\nThe channel id: ${channel_id}\n`);
    }
};
