const { Router } = require('express');
const route = Router();

const config = require('../../configs/index');
const staffList = require('../../configs/staff');

const { newPage } = require('../../utilitys/newPage');

route.get('/', async (req, res) => {
  newPage(res, req, 'others/privacy.ejs', { alert: null, error: null });
});

module.exports = route;
