const { Command } = require('discord.js-commando');
module.exports = class RemovePlayChannelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'remove_play_channel',
            group: 'admin',
            memberName: 'remove_play_channel',
            description: 'Command to remove game lobby from internal DB.',
            ownerOnly: true,
            guildOnly: true,
            args: [
                {
                    key: 'game_name',
                    prompt: 'Which game do you want to create a channel for?',
                    type: 'string',
                },
            ],
        });
    }

    async run(message, { game_name }) {
        const provider = message.client.provider;
        const guild = message.guild;

        const game_channels = provider.get(guild, 'game_channels', new Object());
        if (Object.keys(game_channels).includes(game_name)) {
            delete game_channels[game_name];
            provider.set(guild, 'game_channels', game_channels);
            return message.say('The channel associations have been removed. You need to delete them manually now.');
        }
        else {
            return message.say(`${game_name} doesn't have any associated channels`);
        }
    }
};