const { MessageEmbed } = require('discord.js');
const { Router } = require('express');
const route = Router();
const config = require('../../../configs/index');
const staffList = require('../../../configs/staff');
const { checkAuth } = require('../../../utilitys/checkAuth');
const { newPage } = require('../../../utilitys/newPage');

const devApps = require('../../../models/dev_apps');

route.get('/:appID', checkAuth, async (req, res, next) => {
  if (!staffList.heads.includes(req.user.id))
    return newPage(res, req, 'index.ejs', {
      alert: null,
      error: 'Only the Infinity Staff Team can View this page!',
    });

  let pend_apps = await devApps.find({ appID: req.params.appID });

  newPage(res, req, 'apps/dev/deny.ejs', {
    alert: null,
    error: null,
    app: pend_apps,
  });
});

route.post('/:appID', checkAuth, async (req, res) => {
  if (!staffList.heads.includes(req.user.id))
    return newPage(res, req, 'index.ejs', {
      alert: null,
      error: 'Only the Infinity Staff Team can View this page!',
    });

  let app = await devApps.findOne({ appID: req.params.appID });

  if (!app.status === 'pending')
    return newPage(res, req, 'index.ejs', {
      alert: null,
      error: 'Only Pending Applications can be Approved/Denied!',
      app: app,
    });

  await devApps.updateOne(
    { appID: app.appID },
    { $set: { status: 'denied', staff_reason: req.body.staff_reason } },
  );

  let approveEmbed = new MessageEmbed()
    .setTitle('Developer Application Declined:')
    .setColor('#ab3084')
    .setDescription(`App: **${app.appID}** has been Denied!`)
    .addField('Username:', `${app.userName}`, true)
    .addField('User ID:', `${app.userID}`, true)
    .addField('Moderator:', `${req.user.username}`, true)
    .addField('Reason:', `${app.staff_reason}`, true)
    .setTimestamp()
    .setFooter('© Copyright 2022 - Infinity Applications');

  let approveEmbed2 = new MessageEmbed()
    .setTitle('Developer Application Declined:')
    .setColor('#ab3053')
    .setDescription(`Your App: **${app.appID}** has been Denied!`)
    .addField('Moderator:', `${req.user.username}`, true)
    .addField('Reason:', `${app.staff_reason}`, true)
    .setTimestamp()
    .setFooter('© Copyright 2022 - Infinity Applications');

  await req.app
    .get('client')
    .guilds.cache.get(config.devID)
    .channels.cache.get('948701510089474078')
    .send(approveEmbed);

  await req.app
    .get('client')
    .guilds.cache.get('758641373074423808')
    .members.fetch(app.userID)
    .then(async (user) => {
      await user.send(approveEmbed2);
    });

  newPage(res, req, 'index.ejs', {
    alert: `${app.appID} has been Denied`,
    error: null,
    app: app,
  });
});

module.exports = route;
