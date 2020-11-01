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
        return message.say('I am not implemented yet! Sorry!');
    }
};