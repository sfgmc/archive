const express = require('express');
const router = express.Router();
const passport = require('passport');
const { User } = require('../db/models/UserSchema');
const jwt = require('jsonwebtoken');
const config = require('../config');
const asyncHandler = require('express-async-handler');
const request = require('request');

const verifyToken = token =>
  new Promise((resolve, reject) => {
    if (!token) return resolve(false);
    jwt.verify(token, config.JWTsecret, function(err, decoded) {
      if (err) return resolve(false);
      resolve(decoded);
    });
  });

const verifyAuth0Token = async token => {
  return false;
};
// protected route by web token - Example
router.post(
  '/',
  asyncHandler(async (req, res, next) => {
    console.log('run async handler', config);
    let ctType = 'Content';
    let token;
    // if (req.body.variables && req.body.variables.token) {
    //   token = req.body.variables.token;
    //   delete req.body.variables.token;
    // }
    // if (token) {
    //   const role = await verifyAuth0Token(token)
    // }
    // if (await verifyToken(token)) {
    //   ctType = 'Management';
    // }
    const configVar = `contentful${ctType}Token`;
    console.log(config[configVar]);
    console.log(
      req.body,
      config.contentfulGraphqlEndpoint,
      ctType,
      configVar,
      config[configVar]
    );
    request
      .post(config.contentfulGraphqlEndpoint, {
        json: req.body,
        auth: {
          bearer: config[configVar]
        }
      })
      .pipe(res);
  })
);

module.exports = router;
