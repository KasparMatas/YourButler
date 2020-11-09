const { Command } = require('discord.js-commando');
const { Collection } = require('discord.js');
module.exports = class PrintPlayerProbabilitiesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'print_player_probabilities',
            group: 'print_allocation_stats',
            memberName: 'print_player_probabilities',
            description: 'Command to print player probabilities',
            ownerOnly: true,
            guildOnly: true,
            args: [
                {
                    key: 'player',
                    prompt: 'Which player probabilities do you want to see?',
                    type: 'user',
                    default: '',
                },
            ],
        });
    }

    async run(message, { player }) {

        const provider = message.client.provider;
        const guild = message.guild;

        const registered_players = provider.get(guild, 'registered_players', null);
        const player_registrations = new Collection();
        if (registered_players != null) {
            registered_players.forEach(player_id => {
                const game_list = provider.get(guild, player_id, null);
                if (game_list != null) {
                    player_registrations.set(player_id, game_list);
                }
            });
        }
        else {
            return message.say('No registrations found!');
        }

        if (player == '') {
            await message.guild.members.fetch({ user: registered_players });
            player_registrations.each((game_list, player_id) => {
                let output_string = '';
                output_string += `**${guild.members.cache.get(player_id).user.username}**:\n`;
                Object.entries(game_list).forEach(
                    ([game, probability]) => {
                        output_string += `${game}:${Number.parseFloat(probability).toFixed(5)}\n`;
                    });
                message.say(output_string);
            });
            return message.say('**All probabilities printed.**');
        }
        else if (player_registrations.has(player.id)) {
            return message.say(Object.entries(player_registrations.get(player.id)));
        }
        else {
            return message.say('Player not found!');
        }
    }
};
