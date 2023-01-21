const { MessageEmbed } = require('discord.js');
const { Router } = require('express');
const route = Router();
const config = require('../../configs/index');
const staffList = require('../../configs/staff');
const { checkAuth } = require('../../utilitys/checkAuth');
const { newPage } = require('../../utilitys/newPage');

const staffApps = require('../../models/staff_apps');
const devApps = require('../../models/dev_apps');
const partApps = require('../../models/partner_apps');
const userInfo = require('../../models/users');

route.get('/', checkAuth, async (req, res) => {
  let users = await userInfo.findOne({ userID: req.user.id });

  let staff_apps = await staffApps.find({ userID: req.user.id });
  let dev_apps = await devApps.find({ userID: req.user.id });
  let part_apps = await partApps.find({ userID: req.user.id });

  let data = {
    staff_apps: staff_apps,
    dev_apps: dev_apps,
    part_apps: part_apps,
    profile: users,
    alert: null,
    error: null,
  };

  newPage(res, req, 'users/profile.ejs', data);
});

module.exports = route;
