const Discord = require('devland.js');
const Bot = require('../../structures/client')

module.exports = {
    name: 'bl',
    aliases: ["blacklist"],
    description: 'Blacklist une personne',
    /**
 * @param {Bot} client
 * @param {Discord.Message} message
 */
    run: async (client, message, args) => {
        if (!client.config.bots.buyers.includes(message.author.id)) return;
        const user = message.memberMentions.first()?.user || client.users.get(args[0]) || (args[0] ? await client.fetchUser(args[0]) : undefined)

        if (!user) {
            return message.channel.send(`Aucun utilisateur trouvé !`);
        }

        const blacklist = await client.db.get(`blacklist`) || [];
        if (blacklist.includes(user.id)) {
            return message.channel.send({ content: "Cette personne est déjà présente dans la blacklist !" });
        }

        message.channel.send({ content: "Début de la blacklist..." });

        client.guilds.forEach(guild => {
            guild.banMember(user.id, null, null)
                .then(() => {
                    message.channel.send({ content: `Bannie de ${guild.name}` });
                })
                .catch(() => {
                    message.channel.send({ content: `Impossible de bannir de ${guild.name}` });
                })
        })
        blacklist.push(user.id)

        await client.db.set(`blacklist`, db)
    },
};
