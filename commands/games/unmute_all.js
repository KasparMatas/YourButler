const { Command } = require('discord.js-commando');
module.exports = class unMuteAllCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unmute_all',
            group: 'games',
            memberName: 'unmute_all',
            description: 'Command to unmute all users in your voice channel.',
            guildOnly: true,
        });
    }

    run(message) {
		
		if (message.member.voice.channel) {
  let channel = message.guild.channels.cache.get(message.member.voice.channel.id);
  for (const [memberID, member] of channel.members) {
   
    member.voice.setMute(false);
  }
} else {
  message.reply('You need to join a voice channel first!');
}
     
    }
};