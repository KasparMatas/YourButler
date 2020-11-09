const { Command } = require('discord.js-commando');
const { registerPlayerToGame } = require('../../util');
module.exports = class AddRegistrationCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'add_registration',
            group: 'admin',
            memberName: 'add_registration',
            description: 'Command to add a game to a player\'s registration list',
            ownerOnly: true,
            guildOnly: true,
            args: [
                {
                    key: 'player',
                    prompt: 'Which player\'s registrations do you want extend?',
                    type: 'string',
                },
                {
                    key: 'game',
                    prompt: 'Which game do you want to add to the players list?',
                    type: 'string',
                },
            ],
        });
    }

    run(message, { player, game }) {
        registerPlayerToGame(message, player, game);
    }
};