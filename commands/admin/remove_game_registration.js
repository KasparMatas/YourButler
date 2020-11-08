const { Command } = require('discord.js-commando');
module.exports = class RemoveGameRegistrationCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'remove_game_registration',
            group: 'admin',
            memberName: 'remove_game_registration',
            description: 'Command to remove game registrations.',
            ownerOnly: true,
            guildOnly: true,
            args: [
                {
                    key: 'game_name',
                    prompt: 'Which game do you want to remove?',
                    type: 'string',
                },
            ],
        });
    }

    run(message, { game_name }) {
        const provider = message.client.provider;
        const guild = message.guild;

        const registered_players = provider.set(guild, game_name, null);
        if (registered_players != null) {
            return message.say('Can\'t remove a game with registrations!');
        }

        const available_games = provider.get(guild, 'available_games', new Object());
        if (Object.keys(available_games).includes(game_name)) {
            delete available_games[game_name];
            provider.set(guild, 'available_games', available_games);
            return message.say(`${game_name} removed!`);
        }
        else {
            return message.say(`${game_name} is not in the game list!`);
        }
    }
};