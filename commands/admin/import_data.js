const fetch = require('node-fetch');
const { Command } = require('discord.js-commando');
const { Collection } = require('discord.js');
const { reverseCollection } = require('../../util');
module.exports = class ImportDataCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'import_data',
            group: 'admin',
            memberName: 'import_data',
            description: 'Command to register all of the players in the attached file to their respective games. This does overwrite previous registrations!',
            ownerOnly: true,
            guildOnly: true,
        });
    }

    run(message) {
        if (message.attachments.size == 0) {
            return message.say('No registration data attachment found!');
        }
        else if (message.attachments.size > 1) {
            return message.say('Too many attachements given!');
        }

        const provider = message.client.provider;
        const guild = message.guild;
        const player_probabilities = new Collection();
        const player_registrations = new Collection();

        const current_games = provider.get(guild, 'available_games', []);
        current_games.forEach(game => {
            provider.remove(guild, game);
        });
        const current_players = provider.set(guild, 'registered_players', []);
        current_players.forEach(player => {
            provider.remove(guild, player);
        });

        fetch(message.attachments.first().url)
            .then(res => res.text())
            // Parse registration data
            .then(body => {
                Object.entries(JSON.parse(body)).forEach(([player, game_probabilities]) => {
                    provider.set(guild, player, game_probabilities);
                    if (Object.keys(game_probabilities).length != 0) {
                        player_probabilities.set(player, game_probabilities);
                        player_registrations.set(player, Object.keys(game_probabilities));
                    }
                });
            })
            // Save registration data in alternative forms (Yes, this is a bad idea but a proper DB setup takes time!)
            .then(() => {
                const game_registrations = reverseCollection(player_registrations);

                provider.set(guild, 'available_games', game_registrations.keyArray());
                provider.set(guild, 'registered_players', player_registrations.keyArray());

                game_registrations.each((players, game) => {
                    provider.set(guild, game, players);
                });
            });

        return message.say('Registration data successully replaced.');

    }
};