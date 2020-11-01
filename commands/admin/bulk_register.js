const { Command } = require('discord.js-commando');
module.exports = class BulkRegisterCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bulk_register',
            group: 'admin',
            memberName: 'bulk_register',
            description: 'Command to register all of the players in the attached file to their respective games',
            ownerOnly: true,
            guildOnly: true,
        });
    }

    run(message) {
        if (message.attachments.size != 0) {
            message.attachments.each(attachement => {
                console.log(attachement.url);
            });
        }
        else {
            return message.say('No registration data attachment found');
        }
    }
};