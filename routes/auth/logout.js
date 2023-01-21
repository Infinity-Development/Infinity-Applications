const route = require('express').Router();

route.get('/', (req, res, next) => {
  if (req.user) {
    req.session.destroy();
    res.redirect('/');
  } else {
    res.redirect('/auth/callback');
  }
});

module.exports = route;
