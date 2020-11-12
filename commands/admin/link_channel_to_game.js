const { Command } = require('discord.js-commando');
module.exports = class LinkChannelToGameCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'link_channel_to_game',
            group: 'admin',
            memberName: 'link_channel_to_game',
            description: 'Command to link an existing channel to a game.',
            ownerOnly: true,
            guildOnly: true,
            args: [
                {
                    key: 'existing_channel',
                    prompt: 'Which channel do you want to link?',
                    type: 'voice-channel',
                },
                {
                    key: 'game_name',
                    prompt: 'Which game do you want to link the channel with?',
                    type: 'string',
                },
            ],
        });
    }

    run(message, { existing_channel, game_name }) {
        const provider = message.client.provider;
        const guild = message.guild;

        const available_games = provider.get(guild, 'available_games', new Object());
        if (!Object.keys(available_games).includes(game_name)) {
            return message.say(`${game_name} is not available!`);
        }

        const game_channels = provider.get(guild, 'game_channels', new Object());
        if (Object.keys(game_channels).includes(game_name)) {
            const current_channel = guild.channels.cache.get(game_channels[game_name]);
            return message.say(`${game_name} already has ${current_channel.name} created already`);
        }

        game_channels[game_name] = existing_channel.id;
        provider.set(guild, 'game_channels', game_channels);
        return message.say(`${game_name} has been linked with ${existing_channel.name}`);
    }
};