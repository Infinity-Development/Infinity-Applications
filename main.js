/**
 * Name: Infinity Applications
 * About: Official Recruitment/Application site for Infinity Bot List
 *
 * Author: Toxic Dev @TheRealToxicDev (https://toxicdev.me)
 *
 * Copyrights: © 2021 - 2022 Infinity Bot List
 *
 */

const mongo = require('mongoose');
const config = require('./configs/index');
const Bot = require('./discord/client');
const Website = require('./express/server');

(async () => {
  await mongo.connect(config.mongodb_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  console.log(`[IBL-Apps] Connected to the Database at: ${config.mongodb_url}`);

  let client = await Bot.init(config.token);

  console.log('[IBL-Apps] Client is Online and Ready!');

  await new Website(client).listen(config.port);

  console.log(`[IBL-Apps] Online and Running on PORT: ${config.port}`);
})();
