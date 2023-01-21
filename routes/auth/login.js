const route = require('express').Router();
const session = require('express-session');
const passport = require('passport');
const { MessageEmbed } = require('discord.js');
const { newPage } = require('../../utilitys/newPage');

route.get('/', (req, res, next) => {
  return newPage(res, req, 'auth/login.ejs');
});

module.exports = route;
