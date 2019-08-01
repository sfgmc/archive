let express = require('express');
let router = express.Router();
const passport = require('passport');
const config = require('../config');

router.get('/facebook', passport.authenticate('facebook'));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: config.frontEndServer + '/contribute?error'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect(config.frontEndServer + '/contribute');
  }
);

module.exports = router;
