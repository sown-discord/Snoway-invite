const Bot = require('../../structures/client')
const Discord = require('devland.js')

module.exports = {
    name: 'ready',
    /**
     * @param {Bot} client
     */
    run: async (client) => {
        console.clear()
        console.log(`${client.user.tag} est maintenant connecté à Discord Gateway's`)
        console.log(`Je suis sur ${client.guilds.size} serveur${client.guilds.size < 1 ? '' : 's'}`)
    }
}