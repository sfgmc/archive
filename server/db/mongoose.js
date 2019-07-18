let MongoClient = require('mongodb').MongoClient;
let mongoose = require('mongoose');
let config = require('../config');

// checking for enviroment var for the mongo server and connect to it if there is one
// if there isnt connect to localhost
if (process.env.mongoUrl) {
  mongoose
    .connect(config.mongoUrl, {
      auth: {
        user: config.mongoUsername,
        password: config.mongoPw
      }
    })
    .then(() => console.log('connection successful'))
    .catch(err => console.error(err));
} else {
  var url = 'mongodb://localhost:27017/db';
  mongoose.connect(
    url,
    { useNewUrlParser: true },
    console.log('connected to mongo')
  );
}

//@@@@@@@@@@@@@ if you use local host @@@@@@@@@@@@@@@@@
// var url = "mongodb://localhost:27017/db";
// mongoose.connect(url, { useNewUrlParser: true }, console.log('connected to mongo'));
//@@@@@@@@@@@@@ if you use local host @@@@@@@@@@@@@@@@@

//@@@@@@@@@@@@@ if you dont use local host @@@@@@@@@@@@@@@@@
// mongoose.connect(config.mongoUrl, {
//     auth: {
//       user: config.mongoUsername,
//       password: config.mongoPw
//     }
//   })
//   .then(() => console.log('connection successful'))
//   .catch((err) => console.error(err));
//@@@@@@@@@@@@@ if you dont use local host @@@@@@@@@@@@@@@@@

mongoose.Promise = global.Promise;

module.exports = { mongoose };
