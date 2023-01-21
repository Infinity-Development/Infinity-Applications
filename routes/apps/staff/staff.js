const { MessageEmbed } = require('discord.js');
const { Router } = require('express');
const route = Router();
const config = require('../../../configs/index');
const staffList = require('../../../configs/staff');
const { checkAuth } = require('../../../utilitys/checkAuth');
const { newPage } = require('../../../utilitys/newPage');
const { generateAppID } = require('../../../functions/generateAppID');

const staffApps = require('../../../models/staff_apps');

route.get('/', checkAuth, async (req, res, next) => {
  newPage(res, req, 'apps/staff/app.ejs', { alert: null, error: null });
});

route.post('/', checkAuth, async (req, res, next) => {
  let appID = await generateAppID(5);

  let app_check = await staffApps.findOne({
    userID: req.user.id,
    status: 'pending',
  });

  //let user_check = await req.app.get('client').guilds.cache.get('758641373074423808').members.cache.get(req.user.id);

  //if (!user_check) return newPage(res, req, 'index.ejs', { error: 'You are not a Member of our Discord Server!', alert: null });

  if (app_check) {
    return newPage(res, req, 'index.ejs', {
      error: 'You already have a Pending Staff App!',
      alert: null,
    });
  } else {
    if (req.body.submit) {
      await new staffApps({
        appID: appID,
        userID: req.user.id,
        userName: req.user.username,
        experience: req.body.experience,
        position: req.body.position,
        reason: req.body.reason,
        strength: req.body.strength,
        handle: req.body.handle,
        rules: req.body.rules,
        terms: req.body.terms,
        status: 'pending',
        likes: 0,
        dislikes: 0,
      }).save();

      //let r = client.guilds.cache.get(config.guildID).roles.cache.find(r => r.id === config.staffRole);
      let r = client.guilds.cache
        .get(config.guildID)
        .roles.cache.find((r) => r.id === '907729844605968454');

      await r.setMentionable(true);

      let LogEmbed1 = new MessageEmbed()
        .setTitle('Staff Application:')
        .setColor('#4c32e3')
        .setDescription(`Application ID: **${appID}**`)
        .addField('Username:', `${req.user.username}`, true)
        .addField('User ID:', `${req.user.id}`, true)
        .addField('Position:', 'IBL STAFF', true)
        .addField('Status:', `PENDING REVIEW`, true)
        .addField(
          'App Link:',
          `[View](https://botlist.app/apps/staff/view/${appID}) | [Panel](https://botlist.app/panel) `,
          true,
        )
        .setTimestamp()
        .setFooter('© Copyright 2022 - Infinity Applications');

      await req.app
        .get('client')
        .guilds.cache.get(config.guildID)
        .channels.cache.get(config.staffApps)
        .send(`${r}`);

      await req.app
        .get('client')
        .guilds.cache.get(config.guildID)
        .channels.cache.get(config.staffApps)
        .send(LogEmbed1);

      return newPage(res, req, 'index.ejs', {
        alert: 'Your Staff App has been Submitted!',
        error: null,
      });
    }

    await new staffApps({
      appID: appID,
      userID: req.user.id,
      userName: req.user.username,
      experience: req.body.experience,
      position: req.body.position,
      reason: req.body.reason,
      strength: req.body.strength,
      handle: req.body.handle,
      rules: req.body.rules,
      terms: req.body.terms,
      status: 'pending',
      likes: 0,
      dislikes: 0,
    }).save();

    let r = req.app
      .get('client')
      .guilds.cache.get(config.guildID)
      .roles.cache.find((r) => r.id === config.staffRole);

    await r.setMentionable(true);

    let LogEmbed2 = new MessageEmbed()
      .setTitle('Staff Application:')
      .setColor('#4c32e3')
      .setDescription(`Application ID: **${appID}**`)
      .addField('Username:', `${req.user.username}`, true)
      .addField('User ID:', `${req.user.id}`, true)
      .addField('Position:', 'IBL STAFF', true)
      .addField('Status:', `PENDING REVIEW`, true)
      .addField(
        'App Link:',
        `[View](https://botlist.app/apps/staff/view/${appID}) | [Panel](https://botlist.app/panel) `,
        true,
      )
      .setTimestamp()
      .setFooter('© Copyright 2022 - Infinity Applications');

    await req.app
      .get('client')
      .guilds.cache.get(config.guildID)
      .channels.cache.get(config.staffApps)
      .send(`${r}`);

    await req.app
      .get('client')
      .guilds.cache.get(config.guildID)
      .channels.cache.get(config.staffApps)
      .send(LogEmbed2);

    newPage(res, req, 'index.ejs', {
      alert: 'Your Staff App has been Submitted!',
      error: null,
    });
  }
});

module.exports = route;
