const { Command } = require('discord.js-commando');
module.exports = class CreatePlayChannelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'create_play_channel',
            group: 'admin',
            memberName: 'create_play_channel',
            description: 'Command to create game lobby.',
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

        const available_games = provider.get(guild, 'available_games', new Object());
        if (!Object.keys(available_games).includes(game_name)) {
            return message.say(`${game_name} is not available!`);
        }

        const game_roles = provider.get(guild, 'game_roles', new Object());
        if (!Object.keys(game_roles).includes(game_name)) {
            return message.say(`${game_name} doesn't have an assocaited role!`);
        }
        else {
            const game_channels = provider.get(guild, 'game_channels', new Object());
            const role = await guild.roles.fetch(game_roles[game_name]);
            if (Object.keys(game_channels).includes(game_name)) {
                const existing_channel = guild.channels.cache.get(game_channels[game_name]);
                return message.say(`${game_name} already has ${existing_channel.name} created already`);
            }
            else {
                const new_category = await guild.channels.create(game_name, {
                    type: 'category',
                    permissionOverwrites: [
                        {
                            id: role.id,
                            allow: ['VIEW_CHANNEL'],
                        },
                        {
                            id: guild.roles.everyone.id,
                            deny: ['VIEW_CHANNEL'],
                        },
                    ],
                });
                const new_channel = await guild.channels.create(`${game_name} room`, {
                    type: 'voice',
                    parent: new_category,
                });
                game_channels[game_name] = new_channel.id;
                provider.set(guild, 'game_channels', game_channels);
                return message.say('New channel created');
            }
        }
    }
};