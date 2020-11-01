const fetch = require('node-fetch');
const { Command } = require('discord.js-commando');
module.exports = class BulkRegisterCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bulk_register',
            group: 'admin',
            memberName: 'bulk_register',
            description: 'Command to register all of the players in the attached file to their respective games. This does overwrite previous registrations!',
            ownerOnly: true,
            guildOnly: true,
        });
    }

    run(message) {
        if (message.attachments.size != 0) {
            const provider = message.client.provider;
            const guild = message.guild;
            const available_games = provider.get(guild, 'available_games', []);
            message.attachments.each(attachement => {
                fetch(attachement.url)
                    .then(res => res.text())
                    .then(body => {
                        Object.entries(JSON.parse(body)).forEach(([game, players]) => {
                            provider.set(guild, game, players);
                            if (!available_games.includes(game)) {
                                available_games.push(game);
                            }
                        });
                    });
            });
            provider.set(guild, 'available_games', available_games);
            return message.say('Registration data successully replaced.');
        }
        else {
            return message.say('No registration data attachment found!');
        }
    }
};