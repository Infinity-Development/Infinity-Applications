const { MessageEmbed } = require('discord.js');
const { Router } = require('express');
const route = Router();
const config = require('../../configs/index');
const staffList = require('../../configs/staff');
const { checkAuth } = require('../../utilitys/checkAuth');
const { newPage } = require('../../utilitys/newPage');

const staffApps = require('../../models/staff_apps');

const bodyParser = require('body-parser');

route.use(bodyParser.json());
route.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

route.get('/', checkAuth, async (req, res, next) => {
  if (!staffList.mods.includes(req.user.id))
    return newPage(res, req, 'index.ejs', {
      alert: null,
      error: 'Only the Infinity Staff Team can View this page.',
    });

  let pend_apps = await staffApps.find({ status: 'pending' });

  newPage(res, req, 'panel/main.ejs', {
    alert: null,
    error: null,
    pending: pend_apps,
  });
});

route.post('/', checkAuth, async (req, res, next) => {
  if (!staffList.mods.includes(req.user.id))
    return newPage(res, req, 'index.ejs', {
      alert: null,
      error: 'Only the Infinity Staff Team can View this page.',
    });

  let pend_apps = await staffApps.find({ status: 'pending' });

  if (req.body.approve) {
    let app = await staffApps.findOne({ appID: req.body.appID });

    if (!app)
      return newPage(res, req, 'panel/main.js', {
        alert: null,
        error: 'Unable to Find that App. Has it been Approved/Denied already.',
      });

    await staffApps.updateOne({
      appID: req.body.appID,
      status: 'approved',
      staff_reason: req.body.staff_reason,
    });

    newPage(res, req, 'panel/main.ejs', {
      alert: `${app.appID} has been Approved`,
      error: null,
    });

    let approveEmbed = new MessageEmbed()
      .setTitle(`App Approved: ${app.appID}`)
      .setColor('#7289DA')
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`Approval Message: ${req.body.staff_reason}`)
      .addField('Username:', `${app.userName}`, true)
      .addField('User ID:', `${app.userID}`, true)
      .addField('Moderator:', `${req.user.username}`, true)
      .setTimestamp()
      .setFooter('© Copyright 2022 - Infinity Applications');

    await req.app
      .get('client')
      .guilds.cache.get(config.guildID)
      .channels.cache.get('904858832843440139')
      .send(approveEmbed);

    await req.app
      .get('client')
      .users.fetch(app.userID)
      .send(approveEmbed)
      .catch(() => {});
  } else if (req.body.deny) {
  }

  newPage(res, req, 'panel/main.ejs', {
    alert: null,
    error: null,
    pending: pend_apps,
  });
});

module.exports = route;
