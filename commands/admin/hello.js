const { Command } = require('discord.js-commando');
module.exports = class MeowCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'hello',
            group: 'admin',
            memberName: 'hello',
            description: 'Hello world command',
        });
    }

    run(message) {
        return message.say('World!');
    }
};