const { Command } = require('discord.js-commando');
module.exports = class ChangePrefixCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'change_prefix',
            group: 'admin',
            memberName: 'change_prefix',
            description: 'Command to change the prefix for a given server',
            ownerOnly: true,
            guildOnly: true,
            args: [
                {
                    key: 'prefix',
                    prompt: 'What prefix do you want for the bot?',
                    type: 'string',
                },
            ],
        });
    }

    run(message, { prefix }) {
        message.guild.commandPrefix = prefix;
        return message.say(`Prefix successfully changed to '${prefix}'`);
    }
};