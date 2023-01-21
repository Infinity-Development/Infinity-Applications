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

route.use('/new', require('./dev'));
route.use('/approve', require('./approve'));
route.use('/deny', require('./deny'));
route.use('/view', require('./view'));

module.exports = route;
