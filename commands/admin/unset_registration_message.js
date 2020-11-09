const { Command } = require('discord.js-commando');
module.exports = class UnsetRegistrationMessageCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unset_registration_message',
            group: 'admin',
            memberName: 'unset_registration_message',
            description: 'Command to unset a registration message',
            guildOnly: true,
            adminOnly: true,
        });
    }

    async run(message) {
        const provider = message.client.provider;
        const guild = message.guild;

        provider.remove(guild, 'registration_message_id');
        provider.remove(guild, 'registration_message_channel_id');
        provider.remove(guild, 'listen_to_reactions');

        message.say('Registration message unset!');
    }
};