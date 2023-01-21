const { Client, Collection } = require('discord.js');
const config = require('../configs/index');

const client = new Client({
  disableMentions: 'everyone',
  disabledEvents: ['TYPING_START'],
});

client.commands = new Collection();
client.aliases = new Collection();
client.limits = new Map();

client.on("ready", async (_) => {
  console.log(`${client.user.tag} is online.`);
  client.user.setActivity(`InfinityApplications`, { type: 'WATCHING' });
});

module.exports.init = async (token) => {
  client.userBaseDirectory = __dirname;

  await client.login(config.token);

  return client;
};
