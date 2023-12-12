const Bot = require('../../structures/client')
const Discord = require('devland.js')
module.exports = {
  name: 'message',
     /**
     * @param {Bot} client
     */
  run: async (client, message) => {
    if (!message.guild || message.author.bot) return;
    const db = await client.db.get(`bot_${message.guild.id}`) || []
    const prefix = db.prefix || client.config.defaut.prefix
    client.color = db.color || client.config.defaut.color
    client.prefix = db.prefix || client.config.defaut.prefix
    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
        return message.channel.send(`Mon préfixe sur ce serveur est : \`${prefix}\``).catch(() => {});
    }

    if (!message.content.startsWith(prefix) || message.content === prefix || message.content.startsWith(prefix + ' ')) {
      if (!message.content.startsWith(`<@${client.user.id}>`) && !message.content.startsWith(`<@!${client.user.id}>`)) {
        return;
      }
    }
  
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);    
    const cmdname = args.shift()?.toLowerCase().normalize();
    if (!cmdname) return;
    const cmd = client.commands.get(cmdname) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdname));
    if (!cmd) return;
    
    cmd.run(client, message, args);
    
  }
}
