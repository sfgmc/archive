const passport = require('passport');
const { User } = require('../db/models/UserSchema');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('../config');

passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebookClientId,
      clientSecret: config.facebookClientSecret,
      callbackURL:
        config.facebookCallbackUrl ||
        'http://localhost:3000/auth/facebook/callback',
      profileFields: [
        'id',
        'displayName',
        'email',
        'gender',
        'picture.type(large)'
      ]
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      User.findOne({ facebookId: profile.id }, (err, user) => {
        console.log({ user });
        if (!user) {
          user = new User();
          user.email = profile.emails[0].value;
          user.loginType = 'facebook';
          user.active = true;
          user.dateOfRegistration = new Date();
          user.role = 'guest';
          user.facebookId = profile.id;
        }
        user.name = profile.displayName;
        user.profilePhoto = profile.photos ? profile.photos[0].value : '';
        user.email = profile.emails[0].value;
        user.dateOfLastLogin = new Date();
        console.log(user);
        user.save().then(() => {
          cb(null, user);
        });
      });
    }
  )
);
