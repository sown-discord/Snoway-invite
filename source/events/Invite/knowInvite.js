const Bot = require('../../structures/client');
const Discord = require('devland.js');

module.exports = {
    name: 'knowInvite',
    /**
     * @param {Bot} client
     */
    run: async (client, member, invite) => {

        const cvid = invite.inviter?.id || null;
        console.log('adddddddd')
        let dbserv = await client.db.get(`invite_${member.guild.id}`) || [];
        const find = dbserv.findIndex(db => db.user === cvid);

        if (find !== -1) {
            dbserv[find].total++;
            dbserv[find].join++;
        } else {
            dbserv.push({
                user: cvid,
                total: 1,
                join: 1,
                leave: 0,
                bonus: 0
            });
        }
        await client.db.set(`invite_${member.guild.id}`, dbserv);

        let dbuser = await client.db.get(`inviter_${member.guild.id}`) || [];
        const finds = dbuser.findIndex(db => db.user === member.user.id);

        if (finds !== -1) {
            dbuser[finds].totaljoin++;
            dbuser[finds].date = Date.now();
        } else {
            dbuser.push({
                user: member.user.id,
                code: invite.code,
                inviter: invite.inviter.id,
                date: Date.now(),
                totaljoin: 1
            });
        }
        console.log('adddddddd')
        await client.db.set(`inviter_${member.guild.id}`, dbuser);
        console.log(`${member.user.username} joined ${member.guild.name} with ${invite.code} by ${invite.inviter?.username}`)
    }
}
