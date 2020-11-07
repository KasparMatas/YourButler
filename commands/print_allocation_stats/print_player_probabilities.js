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
                    key: 'player_name',
                    prompt: 'Which player probabilities do you want to see?',
                    type: 'string',
                    default: '',
                },
            ],
        });
    }

    run(message, { player_name }) {

        const provider = message.client.provider;
        const guild = message.guild;

        const registered_players = provider.get(guild, 'registered_players', null);
        const player_registrations = new Collection();
        if (registered_players != null) {
            registered_players.forEach(player => {
                const game_list = provider.get(guild, player, null);
                if (game_list != null) {
                    player_registrations.set(player, game_list);
                }
            });
        }
        else {
            return message.say('No registrations found!');
        }

        if (player_name == '') {
            player_registrations.each((game_list, player) => {
                let output_string = '';
                output_string += `**${player}**:\n`;
                Object.entries(game_list).forEach(
                    ([game, probability]) => {
                        output_string += `${game}:${Number.parseFloat(probability).toFixed(5)}\n`;
                    });
                message.say(output_string);
            });
            return message.say('**All probabilities printed.**');
        }
        else if (player_registrations.has(player_name)) {
            return message.say(Object.entries(player_registrations.get(player_name)));
        }
        else {
            return message.say('Player not found!');
        }
    }
};
