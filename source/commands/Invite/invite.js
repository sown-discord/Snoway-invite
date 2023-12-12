const Discord = require('devland.js');
const Bot = require('../../structures/client');

module.exports = {
    name: 'invites',
    aliases: ["inv", "invite", "invi"],
    description: 'Affiche vos invitations sur le serveur',
    /**
     * @param {Bot} client
     * @param {Discord.Message} message
     */
    run: async (client, message, args) => {
        const user = message.memberMentions.first()?.user || client.users.get(args[0]) || (args[0] ? await client.fetchUser(args[0]) : undefined) || message.author
        if (!user) {
            return message.channel.send(`Aucun utilisateur trouvé !`);
        }

        const dbserv = await client.db.get(`inviter_${message.guild.id}`) || [];
        const dbuser = await client.db.get(`invite_${message.guild.id}`) || [];

        const finduser = dbuser.find(db => db.user === user.id);
        const findserv = dbserv.find(db => db.user === user.id);
        const member = message.guild.members.get(user.id)

        const authors = user.id === message.author.id;
        const timestamp = Math.floor(((findserv ? findserv.date : member.joinedTimestamp)) / 1000);
        const timetampstext = `<t:${timestamp}:R>`;
        const joinRaison = findserv && findserv.code ? findserv.code : "Je ne sais pas";

        const embed = new Discord.Embed();

        embed.color = client.color;

        embed.thumbnail = user.avatar

        embed.title = authors ? "Vos invites" : `Invitations de ${user.username}`;

        embed.description = `\`📊\` **Total:** ${finduser?.total || 0}\n\`➕\` **Joins:** ${finduser?.join || 0}\n\`➖\` **Leave:** ${finduser?.leave || 0}\n\`💎\` **Bonus:** ${finduser?.bonus || 0}\n\n*La dernière fois qu'il a rejoint ${timetampstext} et il a rejoint **${findserv?.totaljoin || 1}** fois, il a rejoins grâce: **${joinRaison}***.`;

        embed.footer = { text: message.author.username, icon_url: message.author.avatar };

        message.channel.send({ embeds: [embed] });
    },
};
