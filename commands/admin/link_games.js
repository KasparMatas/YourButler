const { Command } = require('discord.js-commando');
module.exports = class LinkGamesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'link_games',
            group: 'admin',
            memberName: 'link_games',
            description: 'Command to make sure that a game lobby can only exist when another does as well.',
            ownerOnly: true,
            guildOnly: true,
            args: [
                {
                    key: 'game_name',
                    prompt: 'First game you want to link, please.',
                    type: 'string',
                },
                {
                    key: 'compulsory_game_name',
                    prompt: 'The second game you want to link the first game to, please.',
                    type: 'string',
                },
            ],
        });
    }

    run(message, { game_name, compulsory_game_name }) {
        const provider = message.client.provider;
        const guild = message.guild;

        const available_games = provider.get(guild, 'available_games', new Object());
        if (!Object.keys(available_games).includes(game_name)) {
            return message.say(`${game_name} is not available!`);
        }
        if (!Object.keys(available_games).includes(compulsory_game_name)) {
            return message.say(`${compulsory_game_name} is not available!`);
        }

        const linked_games = provider.get(guild, 'linked_games', new Object());
        if (linked_games[game_name] == compulsory_game_name) {
            return message.say('This requirement is already set!');
        }

        linked_games[game_name] = compulsory_game_name;
        linked_games[compulsory_game_name] = game_name;
        provider.set(guild, 'linked_games', linked_games);
        return message.say(`${game_name} is linked with ${compulsory_game_name}`);
    }
};