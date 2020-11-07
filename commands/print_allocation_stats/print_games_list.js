const { Command } = require('discord.js-commando');
const { getGameRegistrations } = require('../../util');
module.exports = class PrintGamesListCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'print_games_list',
            group: 'print_allocation_stats',
            memberName: 'print_games_list',
            description: 'Command to print all registered for games.',
            ownerOnly: true,
            guildOnly: true,
        });
    }

    run(message) {
        const game_registrations = getGameRegistrations(message);
        if (game_registrations == null) {
            return message.say('No registrations found!');
        }
        else {
            return message.say(`Currently registered for games: ${game_registrations.keyArray()}\n`);
        }
    }
};
