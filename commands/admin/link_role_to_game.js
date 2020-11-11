const { Command } = require('discord.js-commando');
module.exports = class LinkRoleToGameCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'link_role_to_game',
            group: 'admin',
            memberName: 'link_role_to_game',
            description: 'Command to link an existing role to a game.',
            ownerOnly: true,
            guildOnly: true,
            args: [
                {
                    key: 'existing_role',
                    prompt: 'Which role do you want to link?',
                    type: 'role',
                },
                {
                    key: 'game_name',
                    prompt: 'Which game do you want to link the role with?',
                    type: 'string',
                },
            ],
        });
    }

    run(message, { existing_role, game_name }) {
        const provider = message.client.provider;
        const guild = message.guild;

        const available_games = provider.get(guild, 'available_games', new Object());
        if (!Object.keys(available_games).includes(game_name)) {
            return message.say(`${game_name} is not available!`);
        }

        const game_roles = provider.get(guild, 'game_roles', new Object());
        if (Object.keys(game_roles).includes(game_name)) {
            return guild.roles.fetch(game_roles[game_name])
                .then(role => message.say(`${game_name} already has the role ${role.name}`));
        }

        game_roles[game_name] = existing_role.id;
        provider.set(guild, 'game_roles', game_roles);
        return message.say(`${game_name} has been linked with ${existing_role.name}`);
    }
};