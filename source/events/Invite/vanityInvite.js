const Bot = require('../../structures/client');
const Discord = require('devland.js');
const InviteLogger = require('devland.js-invites')

module.exports = {
    name: 'vanityInvite',
    /**
     * @param {Bot} client
     * @param {InviteLogger} member
     */
    run: async (client, member, vanity) => {
        let dbuser = await client.db.get(`inviter_${member.guild.id}`) || [];
        const finds = dbuser.findIndex(db => db.user === member.user.id);
        
        if (finds !== -1) {
            dbuser[finds].totaljoin++;
            dbuser[finds].date = Date.now();
            dbuser[finds].inviter = "Vanity"
        } else {
            dbuser.push({
                user: member.user.id,
                code: vanity.code,
                inviter: "Vanity",
                date: Date.now(),
                totaljoin: 1
            });
        }
        
        await client.db.set(`inviter_${member.guild.id}`, dbuser);
        
        console.log(`${member.user.username} joined ${member.guild.name} with vanity URL ${vanity.code}`);

    }
}

