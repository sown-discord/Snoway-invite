const Discord = require('devland.js');
const Bot = require('../../structures/client');

module.exports = {
    name: 'addbonus',
    aliases: ["bonus", "addb"],
    description: 'Ajoute des invitations bonus à un utilisateur',
    /**
     * @param {Bot} client
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        if (!message.member.hasPermissions("ADMINISTRATOR")) {
            return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.');
        }

        const user = message.memberMentions.first()?.user || client.users.get(args[0]) || (args[0] ? await client.fetchUser(args[0]) : undefined)
        if (!user) {
            return message.channel.send(`Aucun utilisateur trouvé !`);
        }

        const dbuser = await client.db.get(`invite_${message.guild.id}`) || [];

        const finduser = dbuser.find(db => db.user === user.id);

        if (finduser) {
            finduser.bonus = (finduser.bonus || 0) + 1;

            await client.db.set(`invite_${message.guild.id}`, dbuser);

            message.channel.send(`Invitations bonus ajoutées à ${user.tag}.`);
        } else {
            message.channel.send(`${user.tag} n'a pas d'invitations enregistrées sur ce serveur.`);
        }
    },
};
