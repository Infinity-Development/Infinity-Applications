const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const path = require('path');
const app = express();

const config = require('../configs/index');
const staffList = require('../configs/staff');

const templateDir = path.resolve(`${process.cwd()}${path.sep}views`);

module.exports.newPage = async (res, req, template, data = {}) => {
  let client = await req.app.get('client');
  let user = (await req.isAuthenticated()) ? req.user : null;

  const baseData = {
    bot: client,
    path: req.path,
    user: user,
    config: config,
    staff: staffList,
    headerPath: `${templateDir}${path.sep}/partials/head`,
    navbarPath: `${templateDir}${path.sep}/partials/nav`,
    footerPath: `${templateDir}${path.sep}/partials/footer`,
    notifyPath: `${templateDir}${path.sep}/partials/notify`,
  };

  res.render(
    path.resolve(`${templateDir}${path.sep}${template}`),
    Object.assign(baseData, data),
  );
};
