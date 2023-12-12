const {Client, Store, IntentFlags} = require('devland.js')
const fs = require('fs')
const { QuickDB } = require("quick.db");
const InviteLogger = require('devland.js-invites')
module.exports = class Bot extends Client {
    constructor(options = {
        intents: [IntentFlags.ALL],
        enableAllCaches: true,
        presence: {
            activities: [{
                name: "InviteLogger V" + require('../../../package.json').version,
                type: 1, 
                url: 'https://twitch.tv/oni145'
            }]
        }
    }) {
        super(options);
        this.logger = new InviteLogger(this)
        this.setMaxListeners(0)
        this.config = require('../../../config')
        this.db = new QuickDB()
        this.commands = new Store()
        this.initEvents()
        this.initCommands()
        this.support = "https://discord.com/invite/snoway"
        this.connect(this.config.bots.token)
    }

    initCommands() {
      const subFolders = fs.readdirSync("./source/commands");
      for (const category of subFolders) {
          const commandsFiles = fs
              .readdirSync(`./source/commands/${category}`)
              .filter((file) => file.endsWith(".js"));
          for (const commandFile of commandsFiles) {
              const command = require(`../../commands/${category}/${commandFile}`);
              command.category = category;
              command.commandFile = commandFile;
              console.log(`Commande chargée : ${command.name}`);
              this.commands.set(command.name, command);
              if (command.aliases && command.aliases.length > 0) {
                  command.aliases.forEach((alias) => this.commands.set(alias, command));
              }
          }
      }
      let finale = new Store();
      this.commands.map((cmd) => {
          if (finale.has(cmd.name)) return;
          finale.set(cmd.name, cmd);
          this.commands
              .filter((v) => v.name.startsWith(cmd.name) || v.name.endsWith(cmd.name))
              .map((cm) => finale.set(cm.name, cm));
      });
      this.commands = finale;
  }

    initEvents(){
        const subFolders = fs.readdirSync(`./source/events`)
        for(const category of subFolders){
            const files = fs.readdirSync(`./source/events/${category}`)
            for(const file of files){
                const event = require(`../../events/${category}/${file}`)
                this.logger.on(event.name, (...args) => event.run(this, ...args))
                this.on(event.name, (...args) => event.run(this, ...args))
            }
        }
    }
}