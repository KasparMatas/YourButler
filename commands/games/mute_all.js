const { Command } = require('discord.js-commando');
module.exports = class MuteAllCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mute_all',
            group: 'games',
            memberName: 'mute_all',
            description: 'Command to mute all users in your voice channel.',
            guildOnly: true,
            adminOnly: true,
        });
    }

    run(message) {

        if (message.member.voice.channel) {
            let channel = message.guild.channels.cache.get(message.member.voice.channel.id);
            for (const [memberID, member] of channel.members) {

                member.voice.setMute(true);
                member.send("test")
            }
        } else {
            message.reply('You need to join a voice channel first!');
        }

    }
};