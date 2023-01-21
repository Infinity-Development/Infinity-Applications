const ejs = require('ejs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('../configs/index');
const passport = require('passport');
const Strategy = require('passport-discord').Strategy;
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const { newPage } = require('../utilitys/newPage');

const getFilesSync = require('../utilitys/fileLooping');

class App {
  constructor(client, locals = {}) {
    this.express = express();
    this.express.set('views', 'views');
    this.express.engine('html', ejs.renderFile);
    this.express.set('view engine', 'html');
    this.express.set('client', client);
    this.express.use('/static', express.static(path.join('public')));
    this.express.use('/images', express.static(path.join('images')));
    this.express.use(cookieParser());
    this.express.use(bodyParser.json());
    this.express.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    );
    this.express.use(
      session({
        cookie: { maxAge: require('ms')('1 year') },
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        secret: config.secret,
        resave: false,
        saveUninitialized: false,
      }),
    );
    this.express.use(passport.initialize());
    this.express.use(passport.session());

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

    this.express.locals = locals;
    this.loadRoutes().loadErrorHandler();
  }

  listen(port) {
    return new Promise((resolve) => this.express.listen(port, resolve));
  }

  loadRoutes() {
    const routesPath = path.join(__dirname, '../routes');
    const routes = getFilesSync(routesPath);

    if (!routes.length) return this;

    routes.forEach((filename) => {
      const route = require(path.join(routesPath, filename));

      const routePath =
        filename === 'Router.js' ? '/' : `/${filename.slice(0, -3)}`;

      try {
        this.express.use(routePath, route);
      } catch (error) {
        console.error(`Error occured with the route "${filename}"\n\n${error}`);
      }
    });

    return this;
  }

  loadErrorHandler() {
    this.express.use((error, _req, res, _next) => {
      const { message, statusCode = 500 } = error;
      if (statusCode >= 500) {
        console.error(error);
      }
      res.status(statusCode).send({
        message,
        status: statusCode,
      });
    });

    return this;
  }
}

module.exports = App;
