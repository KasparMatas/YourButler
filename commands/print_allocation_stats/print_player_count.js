const { Command } = require('discord.js-commando');
const { getPlayerRegistrations } = require('../../util');
module.exports = class PrintPlayerCountCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'print_player_count',
            group: 'print_allocation_stats',
            memberName: 'print_player_count',
            description: 'Command to print registered player count',
            ownerOnly: true,
            guildOnly: true,
        });
    }

    run(message) {
        const player_registrations = getPlayerRegistrations(message);
        if (player_registrations == null) {
            return message.say('No registrations found!');
        }
        else {
            return message.say(`Currently there are ${player_registrations.keyArray().length} players registered!`);
        }
    }
};
