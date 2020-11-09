const { Command } = require('discord.js-commando');
const { unregisterPlayerFromGame } = require('../../util');
module.exports = class RemoveRegistrationCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'remove_registration',
            group: 'admin',
            memberName: 'remove_registration',
            description: 'Command to remove a game from a player\'s registration list',
            ownerOnly: true,
            guildOnly: true,
            args: [
                {
                    key: 'player',
                    prompt: 'Which player\'s registrations do you want change?',
                    type: 'string',
                },
                {
                    key: 'game',
                    prompt: 'Which game do you want to remove from the players list?',
                    type: 'string',
                },
            ],
        });
    }

    run(message, { player, game }) {
        unregisterPlayerFromGame(message, player, game);
    }
};