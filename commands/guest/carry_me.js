const { Command } = require('discord.js-commando');
module.exports = class CarryMeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'carry_me',
            group: 'guest',
            memberName: 'carry_me',
            description: 'Command to move you to your allocated voice channel.',
            guildOnly: true,
        });
    }

    run(message) {
        const provider = message.client.provider;
        const guild = message.guild;

        const game_roles = provider.get(guild, 'game_roles', null);
        if (game_roles == null) {
            return message.say('Not all roles have been setup yet!');
        }
        const game_channels = provider.get(guild, 'game_channels', null);
        if (game_channels == null) {
            return message.say('Not all channels have been setup yet!');
        }
        const user_roles = message.member.roles.cache;
        if (user_roles.keys().length == 0) {
            return message.say('You don\'t have any roles');
        }

        let found_game = null;
        user_roles.keyArray().forEach((id) => {
            Object.keys(game_roles).forEach(game => {
                if (game_roles[game] == id) {
                    found_game = game;
                }
            });
        });
        if (found_game == null) {
            return message.say('Sorry you don\'t have any roles to allocate you anywhere.');
        }
        if (!Object.keys(game_channels).includes(found_game)) {
            return message.say(`${found_game} doesn't have a channel setup. Sorry.`);
        }
        const destination_channel = guild.channels.cache.get(game_channels[found_game]);
        return message.say(`You'r channel is ${destination_channel.name}`);
    }
};