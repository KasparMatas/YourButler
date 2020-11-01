const { Command } = require('discord.js-commando');
module.exports = class MuteAllCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mute_all',
            group: 'games',
            memberName: 'mute_all',
            description: 'Command to mute all users in your voice channel.',
            guildOnly: true,
        });
    }

    run(message) {
        return message.say('I am not implemented yet! Sorry!');
    }
};