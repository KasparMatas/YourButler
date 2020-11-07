const { Command } = require('discord.js-commando');
module.exports = class HelloWorldCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'hello',
            group: 'guest',
            memberName: 'hello',
            description: 'Hello world command',
            ownerOnly: false,
        });
    }

    run(message) {
        return message.say('Sup?');
    }
};