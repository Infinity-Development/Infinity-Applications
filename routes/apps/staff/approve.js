const { MessageEmbed } = require('discord.js');
const { Router } = require('express');
const route = Router();
const config = require('../../../configs/index');
const staffList = require('../../../configs/staff');
const { checkAuth } = require('../../../utilitys/checkAuth');
const { newPage } = require('../../../utilitys/newPage');

const staffApps = require('../../../models/staff_apps');

route.get('/:appID', checkAuth, async (req, res, next) => {
  if (!staffList.managers.includes(req.user.id))
    return newPage(res, req, 'index.ejs', {
      alert: null,
      error: 'Only the Infinity Staff Team can View this page!',
    });

  let app = await staffApps.findOne({ appID: req.params.appID });

  newPage(res, req, 'apps/staff/approve.ejs', {
    alert: null,
    error: null,
    app: app,
  });
});

route.post('/:appID', checkAuth, async (req, res) => {
  if (!staffList.managers.includes(req.user.id))
    return newPage(res, req, 'index.ejs', {
      alert: null,
      error: 'Only the Infinity Staff Team can View this page!',
    });

  let app = await staffApps.findOne({ appID: req.params.appID });

  if (!app.status === 'pending')
    return newPage(res, req, 'index.ejs', {
      alert: null,
      error: 'Only Pending Applications can be Approved/Denied!',
      pending: app,
    });

  await staffApps.updateOne(
    { appID: app.appID },
    { $set: { status: 'approved', staff_reason: req.body.staff_reason } },
  );

  let approveEmbed = new MessageEmbed()
    .setTitle('Staff Application Approved:')
    .setColor('#3287a8')
    .setDescription(`App: **${app.appID}** has been Approved!`)
    .addField('Username:', `${app.userName}`, true)
    .addField('User ID:', `${app.userID}`, true)
    .addField('Moderator:', `${req.user.username}`, true)
    .addField('Reason:', `${app.staff_reason}`, true)
    .addField(
      'Info:',
      'They have been sent the staff and testing server invites.',
    )
    .setTimestamp()
    .setFooter('© Copyright 2022 - Infinity Applications');

  let approveEmbed2 = new MessageEmbed()
    .setTitle('Staff Application Approved:')
    .setColor('#32a852')
    .setDescription(`Your App: **${app.appID}** has been Approved!`)
    .addField('Moderator:', `${req.user.username}`, true)
    .addField('Reason:', `${app.staff_reason}`, true)
    .addField(
      'Links:',
      `[Staff Server](https://discord.gg/gnwBsxqVV2) | [Testing Server](https://discord.gg/b5p2JPE5zE)`,
      true,
    )
    .setTimestamp()
    .setFooter('© Copyright 2022 - Infinity Applications');

  await req.app
    .get('client')
    .guilds.cache.get(config.guildID)
    .channels.cache.get('870950610692878338')
    .send(approveEmbed);

  await req.app
    .get('client')
    .guilds.cache.get('758641373074423808')
    .members.fetch(app.userID)
    .then(async (user) => {
      await user.send(approveEmbed2).catch(() => {});

      await user.roles.add('762371586434793472').catch(() => {});
    });

  newPage(res, req, 'apps/staff/approve.ejs', {
    alert: `Application: ${app.appID} has been Approved`,
    error: null,
    app: app,
  });
});

module.exports = route;
