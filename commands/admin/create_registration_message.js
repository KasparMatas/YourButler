const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
module.exports = class CreateRegistrationMessageCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'create_registration_message',
            group: 'admin',
            memberName: 'create_registration_message',
            description: 'Command to create a registration message in the specified channel.',
            guildOnly: true,
            adminOnly: true,
            args: [
                {
                    key: 'registration_channel',
                    prompt: 'What channel should this message be sent too?',
                    type: 'text-channel',
                },
            ],
        });
    }

    async run(message, { registration_channel }) {
        const provider = message.client.provider;
        const guild = message.guild;

        const available_games = provider.get(guild, 'available_games', new Object());
        if (Object.values(available_games).length == 0) {
            return message.say('No games have been made available yet!');
        }
        if (provider.get(guild, 'registration_message_id', null) != null) {
            return message.say('There already exists a registration message!');
        }

        const embed = new MessageEmbed()
            .setColor('#32a858')
            .setTitle('Registrations')
            .setDescription('Below you can see which emoji you need to click to register/unregister.');

        Object.entries(available_games).forEach(([game, emoji]) => {
            embed.addFields({ name: game, value: emoji, inline: true });
        });

        const registration_message = await registration_channel.send(embed);
        await registration_message.pin();

        await Object.values(available_games).reduce(async (promise, emoji) => {
            await promise;
            await registration_message.react(emoji);
        }, Promise.resolve());

        provider.set(guild, 'registration_message_id', registration_message.id);
        provider.set(guild, 'registration_message_channel_id', registration_channel.id);
        provider.set(guild, 'listen_to_reactions', 'true');
    }
};