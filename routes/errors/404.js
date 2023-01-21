/**
 * Name: Infinity Applications
 * About: Official Recruitment/Application site for Infinity Bot List
 *
 * Author: Toxic Dev @TheRealToxicDev
 *
 * Copyrights: © 2021 - 2022 Infinity Bot List
 *
 */

const { Router } = require('express');
const route = Router();

const config = require('../../configs/index');
const staffList = require('../../configs/staff');
const { newPage } = require('../../utilitys/newPage');

route.get('/', async (req, res) => {
  newPage(res, req, 'status/404.ejs');
});

module.exports = route;
