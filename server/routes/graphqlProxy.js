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

// protected route by web token - Example
router.post(
  '/',
  asyncHandler(async (req, res, next) => {
    let ctType = 'Content';
    let token = req.body.token; // taking the token we passed in the request
    if (await verifyToken(token)) {
      ctType = 'Management';
    }
    console.log(
      req.body,
      config.contentfulGraphqlEndpoint,
      config[`contenful${ctType}Token`]
    );
    request
      .post(config.contentfulGraphqlEndpoint, {
        json: req.body,
        auth: {
          bearer: config[`contenful${ctType}Token`]
        }
      })
      .pipe(res);
  })
);

module.exports = router;
