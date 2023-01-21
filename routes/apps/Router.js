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

route.use('/staff', require('./staff/Router'));
route.use('/devs', require('./dev/Router'));

module.exports = route;
