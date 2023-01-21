const { MessageEmbed } = require('discord.js');

const { Router } = require('express');
const route = Router();

const config = require('../../../configs/index');
const staffList = require('../../../configs/staff');

const { checkAuth } = require('../../../utilitys/checkAuth');
const { newPage } = require('../../../utilitys/newPage');

const staffApps = require('../../../models/staff_apps');

route.get('/:appID', checkAuth, async (req, res, next) => {
  let Applications = await staffApps.findOne({ appID: req.params.appID });

  newPage(res, req, 'apps/staff/view.ejs', {
    apps: Applications,
    alert: null,
    error: null,
  });
});

module.exports = route;
