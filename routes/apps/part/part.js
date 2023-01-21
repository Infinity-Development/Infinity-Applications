const { MessageEmbed } = require('discord.js');
const { Router } = require('express');
const route = Router();
const config = require('../../../configs/index');
const staffList = require('../../../configs/staff');
const { checkAuth } = require('../../../utilitys/checkAuth');
const { newPage } = require('../../../utilitys/newPage');

const partnerApps = require('../../../models/partner_apps');

route.get('/', checkAuth, async (req, res, next) => {
  newPage(res, req, 'apps/part_apps.ejs', { alert: null, error: null });
});

route.post('/', checkAuth, async (req, res, next) => {
  let appID = Math.random().toString(36).substr(2, 5);

  let app_check = await partnerApps.findOne({
    userID: req.user.id,
    status: 'pending',
  });

  let user_check = await req.app
    .get('client')
    .guilds.cache.get('758641373074423808')
    .members.cache.get(req.user.id);

  if (!user_check)
    return newPage(res, req, 'index.ejs', {
      error:
        'You are not a Member of our Discord Server, Please join our Server.',
      alert: null,
    });

  if (app_check) {
    return newPage(res, req, 'index.ejs', {
      error: 'You already have a Pending Partner App.',
      alert: null,
    });
  } else {
    if (req.body.submit) {
      await new partnerApps({
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

      let r = client.guilds.cache
        .get(config.guildID)
        .roles.cache.find((r) => r.id === config.staffRole);

      await r.setMentionable(true);

      let LogEmbed1 = new MessageEmbed()
        .setTitle('Partner Application:')
        .setColor('#3455eb')
        .setDescription(`Application ID: **${appID}**`)
        .addField('Username:', `${req.user.username}`, true)
        .addField('User ID:', `${req.user.id}`, true)
        .addField('Position:', 'Partner', true)
        .addField('Status:', `PENDING REVIEW`, true)
        .addField(
          'App Link:',
          `[View](https://apps.botlist.site/apps/view/${appID}) | [Panel](https://apps.botlist.site/panel) `,
          true,
        )
        .setTimestamp()
        .setFooter('© Copyright 2021 - Infinity Applications');

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
        alert: 'Your Partner App has been Submitted!',
        error: null,
      });
    }

    await new partnerApps({
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
      .setTitle('Partner Application:')
      .setColor('#7d34eb')
      .setDescription(`Application ID: **${appID}**`)
      .addField('Username:', `${req.user.username}`, true)
      .addField('User ID:', `${req.user.id}`, true)
      .addField('Position:', 'Partner', true)
      .addField('Status:', `PENDING REVIEW`, true)
      .addField(
        'App Link:',
        `[View](https://apps.botlist.site/apps/view/${appID}) | [Panel](https://apps.botlist.site/panel) `,
        true,
      )
      .setTimestamp()
      .setFooter('© Copyright 2021 - Infinity Applications');

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
      alert: 'Your Partner App has been Submitted!',
      error: null,
    });
  }
});

module.exports = route;
