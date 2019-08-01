let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let config = require('../config');
let { User } = require('../db/models/UserSchema');



router.get('/:token/:email', (req, res) => {
  let token = req.params.token;
  let email = req.params.email
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.JWTsecret, function (err, decoded) { // using the token we passed to authonticate the account
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    User.findOneAndUpdate(
      { email: email },
      { active: true },
      { new: true },
      (err, userAcc) => {
        if (err) {
          res.send(err)
        } else {
          res.send('Thank you! (:')
        }
      });
  })
})

module.exports = router;