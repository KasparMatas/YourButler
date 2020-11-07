const { Command } = require('discord.js-commando');
const { TextChannel } = require("discord.js")
const Discord = require("discord.js")
module.exports = class MuteAllCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'send_msg_channel',
            group: 'games',
            memberName: 'send_msg_channel',
            description: 'Command to mute all users in your voice channel.',
            guildOnly: true,
			 args: [
                {
                    key: 'Channel_name',
                    prompt: 'What channel should this message be sent too?',
                    type: 'string',
                },
               {
                    key: 'txt',
                    prompt: 'Please enter a message to send',
                    type: 'string',
                },
              
            ],
        });
    }

    run(message, { channel_name, txt}) {
	const client = message.client
	
	let args = message.content.split(' ');
	let channel = ""
	
	
	// This is a placeholder. More can be added when the server has been created
	if (args[1] = 'general'){
		
		console.log(args[1])
		channel = client.channels.cache.get('773632956945399858')
	}
		
		
	
	
	
	
	if (channel instanceof TextChannel) {
		channel.send(txt)
	}
	
	
    }
};