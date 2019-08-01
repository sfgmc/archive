let { User } = require('../db/models/UserSchema');
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let config = require('../config');
const nodemailer = require('nodemailer');
const emailTemp = require('../helpers/signupEmailTemp')
const isEmail = require('is-email')

// validate if the input is valid email
function emailValitade(email) {
  return isEmail(email)
}



router.post('/', (req, res) => {


  const isEmailValidate = emailValitade(req.body.username); // validation the email

  if (isEmailValidate) {
    let token = jwt.sign({ email: req.body.email }, config.JWTsecret, {}); // assigning token which be userd to activate the signed account
    console.log('req.body.username', req.body.username)
    // register new account using middleware from Passport
    User.register(new User({
      username: req.body.username,
      active: false,
      login: false,
      email: req.body.username,
      password: req.body.password
    }), req.body.password, (err, account) => {
      if (err) {
        // can be also an error validation that the username is exist
        console.log('error', err)
        res.send(err)
      } else {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        nodemailer.createTestAccount((err, mailAcc) => {
          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: config.smtp,
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: config.nodemailerEmail, // generated ethereal user
              pass: config.nodemailerPw // generated ethereal password
            }
          });
          let msg = `please validate your account ${config.server}/activate/${token}/${req.body.email}`
          // setup email data with unicode symbols
          let mailOptions = {
            from: config.nodemailerEmail, // sender address
            to: req.body.email, // list of receivers
            subject: `thanks for signing up (: `, // Subject line
            html: emailTemp(req, res, token)
          };//

          // send mail with defined transport object
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

          });
        });
        res.send({ msg: 'check your email', account: account })
      }
    });
  }
});




module.exports = router;