let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');
let passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
  email: { type: String, index: true, required: true },
  name: { type: String, required: true },
  loginType: { type: String }, // email | facebook
  facebookId: { type: String },
  profilePhoto: { type: String },
  active: { type: Boolean }, // the user activate his account
  login: { type: Boolean }, // the user is login or not
  dateOfRegistration: { type: Date },
  dateOfLastLogin: { type: Date },
  role: { type: String, default: 'guest' }
  // role: 'guest' | 'contributor' | 'verified-contributor' | 'admin'
});

UserSchema.plugin(uniqueValidator);
UserSchema.plugin(passportLocalMongoose, {
  findByUsername: function(model, queryParameters) {
    // Add additional query parameter - AND condition - active: true
    queryParameters.active = true;
    return model.findOne(queryParameters);
  }
});

let User = mongoose.model('userTest', UserSchema);

module.exports = { User };
