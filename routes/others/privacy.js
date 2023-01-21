const { Router } = require('express');
const route = Router();

route.get('/', async (req, res) => {
  res.redirect('https://infinitybots.gg/privacy');
});

module.exports = route;
