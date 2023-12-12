const Bot = require('../../structures/client');
const Discord = require('devland.js');

module.exports = {
    name: 'memberJoin',
    /**
     * @param {Bot} client
     */
    run: async (client, member) => {

        if (!member.data_is_available) return console.log("Member cache is disabled")

        let dbserv = await client.db.get(`invite_${member.guild.id}`) || [];
        const find = dbserv.findIndex(db => db.user === member.id);

        if (find !== -1) {
            const inviterID = dbserv[find].user;
            let dbuser = await client.db.get(`inviter_${member.guild.id}`) || [];
            const finds = dbuser.findIndex(db => db.user === inviterID);

            if (finds !== -1) {
                dbuser[finds].totaljoin++;
                dbuser[finds].leave++;
            }
            dbuser[finds].totaljoin++;
            dbserv[find].leave++;
            await client.db.set(`inviter_${member.guild.id}`, dbuser);
            await client.db.set(`invite_${member.guild.id}`, dbserv);

            console.log(`${member.user.username} left ${member.guild.name}, invited by ${inviterID}`);
        } else {
            console.log(`${member.user.username} left ${member.guild.name}, but was not invited`);
        }

    }
}