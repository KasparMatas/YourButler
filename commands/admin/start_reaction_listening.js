const { Command } = require('discord.js-commando');
module.exports = class StartReactionListeningCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'start_reaction_listening',
            group: 'admin',
            memberName: 'start_reaction_listening',
            description: 'Command to start listening to the reactions on the registration message.',
            guildOnly: true,
            adminOnly: true,
        });
    }

    async run(message) {
        const provider = message.client.provider;
        const guild = message.guild;

        const registration_message_id = provider.get(guild, 'registration_message_id', null);
        const registration_message_channel_id = provider.get(guild, 'registration_message_channel_id', null);

        if (registration_message_id == null || registration_message_channel_id == null) {
            return message.say('No registration message is not setup properly!');
        }
        const available_games = provider.get(guild, 'available_games', new Object());
        if (Object.values(available_games).length == 0) {
            return message.say('No games have been made available yet!');
        }
        // Cache the pinned message
        const pinned_messages = await message.guild.channels.cache.get(registration_message_channel_id).messages.fetchPinned();
        await pinned_messages.get(registration_message_id).fetch();

        provider.set(guild, 'listen_to_reactions', 'true');
    }
};