const Discord = require('devland.js');
const Bot = require('../../structures/client')

module.exports = {
    name: 'ping',
    aliases: ["ms"],
    description: 'Affiche la latence du bot.',
    /**
 * @param {Bot} client
 * @param {Discord.Message} message
 */
    run: async (client, message, args) => {
        if (!client.config.bots.buyers.includes(message.author.id)) return;

        message.reply(client.ws.ping + "**ms**")
    },
};
