const { MessageEmbed } = require('discord.js');

const { Router } = require('express');
const route = Router();

const config = require('../../../configs/index');
const staffList = require('../../../configs/staff');

const { checkAuth } = require('../../../utilitys/checkAuth');
const { newPage } = require('../../../utilitys/newPage');

const devApps = require('../../../models/dev_apps');

route.get('/:appID', checkAuth, async (req, res, next) => {
  let app = await devApps.findOne({ appID: req.params.appID });

  if (!app)
    return newPage(res, req, 'index.ejs', {
      alert: null,
      error: 'The App you are looking for does not exist!',
    });

  newPage(res, req, 'apps/dev/view.ejs', {
    apps: app,
    alert: null,
    error: null,
  });
});

module.exports = route;
