const { Command } = require('discord.js-commando');
module.exports = class CreateAllocationChannelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'create_main_room',
            group: 'admin',
            memberName: 'create_main_room',
            description: 'Command to create allocation voice channel.',
            ownerOnly: true,
            guildOnly: true,
        });
    }

    async run(message) {
        const provider = message.client.provider;
        const guild = message.guild;

        const new_channel = await guild.channels.create('Main room', {
            type: 'voice',
        });
        provider.set(guild, 'main_room', new_channel.id);
        return message.say('New main room created!');
    }
};