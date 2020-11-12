const { Command } = require('discord.js-commando');
module.exports = class ClearAllGameLinksCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clear_all_game_links',
            group: 'admin',
            memberName: 'clear_all_game_links',
            description: 'Command to clear all links between games',
            ownerOnly: true,
            guildOnly: true,
        });
    }

    run(message) {
        const provider = message.client.provider;
        const guild = message.guild;

        provider.set(guild, 'linked_games', new Object());
        return message.say('Links cleared!');
    }
};