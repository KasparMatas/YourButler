const { Command } = require('discord.js-commando');
module.exports = class HelloWorldCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'hello',
            group: 'admin',
            memberName: 'hello',
            description: 'Hello world command',
            ownerOnly: true,
        });
    }

    run(message) {
        return message.say('World!');
    }
};