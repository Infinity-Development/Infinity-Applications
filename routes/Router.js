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
const config = require('../configs/index');
const staffList = require('../configs/staff');
const { newPage } = require('../utilitys/newPage');
const passport = require('passport');
const Strategy = require('passport-discord').Strategy;
const { checkAuth } = require('../utilitys/checkAuth');

const staffApps = require('../models/staff_apps');
const userInfo = require('../models/users');

/** INITIALIZE AND USE PASSPORT */
route.use(passport.initialize());
route.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new Strategy(
    {
      clientID: config.ClientID,
      clientSecret: config.ClientSecret,
      callbackURL: config.RedirectURI,
      scope: ['identify'],
    },
    (accessToken, refreshToken, profile, done) => {
      // eslint-disable-line no-unused-vars
      // On login we pass in profile with no logic.
      process.nextTick(() => done(null, profile));
    },
  ),
);

/** BEGIN THE MAIN PAGE ROUTING */
route.use('/', require('./main/index'));

/** BEGIN THE OAUTH PAGE ROUTING */
route.use('/login', require('./auth/login'));
route.use('/callback', require('./auth/callback'));
route.use('/logout', require('./auth/logout'));

/** BEGIN THE APPS PAGE ROUTING */
route.use('/apps', require('./apps/Router'));

/** BEGIN THE USER PAGE ROUTING */
route.use('/profile', require('./user/profile'));

/** BEGIN THE PANEL ROUTING */
route.use('/panel', require('./panel/main'));

/** BEGIN ERROR PAGE ROUTING */
route.use('/404', require('./errors/404'));
route.use('/400', require('./errors/404'));

/** BEGIN LEGAL PAGE ROUTING */
route.use('/terms', require('./others/terms'));
//route.use('/privacy', require('./others/privacy'));

route.use(function (req, res) {
  res.status(404);
  res.status(404).redirect('/404');
});

route.use(function (error, req, res) {
  res.status(500).redirect('/500');
  console.log(`[IBL-Apps] Internal Server Error | ${error}`);
});

module.exports = route;
