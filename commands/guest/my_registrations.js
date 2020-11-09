const { Command } = require('discord.js-commando');
const { getPlayerRegistrations } = require('../../util');
module.exports = class HelloWorldCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'my_registrations',
            group: 'guest',
            memberName: 'my_registrations',
            description: 'Command to see your registrations.',
            ownerOnly: false,
        });
    }

    run(message) {
        const player_registrations = getPlayerRegistrations(message);
        if (player_registrations.has(message.author.id)) {
            return message.say(player_registrations.get(message.author.id));
        }
        else {
            return message.say('You have no registrations!');
        }
    }
};