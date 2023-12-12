const Bot = require('../../structures/client');
const Discord = require('devland.js');

module.exports = {
    name: 'unknowInvite',
    /**
     * @param {Bot} client
     */
    run: async (client, member) => {

        let dbuser = await client.db.get(`inviter_${member.guild.id}`) || [];
        const finds = dbuser.findIndex(db => db.user === member.user.id);

        if (finds !== -1) {
            dbuser[finds].totaljoin++;
            dbuser[finds].date = Date.now();
            dbuser[finds].inviter = "unknow"
        } else {
            dbuser.push({
                user: member.user.id,
                code: "unknow",
                inviter: "unknow",
                date: Date.now(),
                totaljoin: 1
            });
        }

        await client.db.set(`inviter_${member.guild.id}`, dbuser);
        const msg = await client.db.get(`joinsmsg_${member.guild.id}`) || null

        console.log(`${member.user.username} joined ${member.guild.name} but I don't know how`);

    }
}