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

route.get('/', checkAuth, async (req, res, next) => {
  if (!staffList.mods.includes(req.user.id))
    return newPage(res, req, 'index.ejs', {
      alert: null,
      error: 'Only the Infinity Staff Team can View this page.',
    });

  let pend_staff_apps = await staffApps.find({ status: 'pending' });
  let pend_dev_apps = await devApps.find({ status: 'pending' });
  let pend_part_apps = await partApps.find({ status: 'pending' });

  newPage(res, req, 'panel/main.ejs', {
    alert: null,
    error: null,
    pending_staff: pend_staff_apps,
    pending_devs: pend_dev_apps,
    pending_partner: pend_part_apps,
  });
});

module.exports = route;
