let { User } = require('../db/models/UserSchema');
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let config = require('../config');
let passport = require('passport');




router.post('/', (req, res) => {
  let token = req.body.token;
  let email = req.body.email

  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.JWTsecret, function (err, decoded) { // using the token we passed to authonticate the account
    if (err) return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
    User.findOne({ email: email }, (e, user) => {
      if (e) {
        console.log('error resetting password', e)
        res.send({ 'error': e })
      } if (!user) {
        res.send('no user found')
      } else {
        user.setPassword(req.body.password, (err, user) => {
          if (err) { console.log(err) }
          user.save((err) => {

            if (err) {
              console.log(err)
              res.send('password couldne be changed')
            } else {
              res.send('password changed')
            }
          });
        })
      }
    })
  })
})

module.exports = router