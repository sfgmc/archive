let express = require('express');
let router = express.Router();
let passport = require('passport');
let { User } = require('../db/models/UserSchema');
let jwt = require('jsonwebtoken');
let config = require('../config');
const isEmail = require('is-email')

// validate if the input is valid email
function emailValitade(email) {
  return isEmail(email)
}


router.post('/', passport.authenticate('local'), function (req, res) {

  const isEmailValidate = emailValitade(req.body.username); // validation the email

  if (isEmailValidate) {

    User.findOneAndUpdate(
      { username: req.body.username },
      { login: true },
      { new: true },
      (err, userAcc) => {
        if (err) {
          console.log('err', err)
          res.send(err)
        } else if (req.user) {

          // generating login token
          let token = jwt.sign({
            email: req.body.email,
            hash: req.user.hash,
            salt: req.user.salt
          }, config.JWTsecret, {}); // assigning token which be userd to activate the signed account

          res.send({ msg: 'you logged in', user: req.user, token: token })
        }
      }
    );
  }
});



module.exports = router;