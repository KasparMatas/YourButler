const { Command } = require('discord.js-commando');
module.exports = class CreateRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'create_role',
            group: 'admin',
            memberName: 'create_role',
            description: 'Command to create a role for game lobby allocation.',
            ownerOnly: true,
            guildOnly: true,
            args: [
                {
                    key: 'game_name',
                    prompt: 'Which game do you want to create a role for?',
                    type: 'string',
                },
            ],
        });
    }

    run(message, { game_name }) {
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

        const role_name = `Playing:${game_name}`;
        guild.roles.create({
            data: { name: role_name },
            hoist: true,
            mentionable: true,
        })
            .then(role => {
                game_roles[game_name] = role.id;
                provider.set(guild, 'game_roles', game_roles);
                return message.say(`New role Playing:${game_name} created!`);
            });
    }
};