require('dotenv').config();

const request = require('request');
const cors = require('micro-cors');
const { router, post, options } = require('micro-fork');
const {
  compose,
  respondToLivenessProbe,
  parseJSONInput
} = require('micro-hoofs');
const visualize = require('micro-visualize');

const isDev = process.env.NODE_ENV !== 'production';

const routeGQL = async (req, res) => {
  console.log('hitting route');
  // get auth0 user profile

  // forward request to contentful
  let ctType = 'CONTENT';

  // upgrade ctType here if profile calls for it

  const configVar = `CONTENTFUL_${ctType}_TOKEN`;
  console.log(
    req.json,
    process.env.CONTENTFUL_GRAPHQL_ENDPOINT,
    ctType,
    configVar,
    process.env[configVar]
  );
  request
    .post(process.env.CONTENTFUL_GRAPHQL_ENDPOINT, {
      json: req.json,
      auth: {
        bearer: process.env[configVar]
      }
    })
    .pipe(res);
};

const routeOptions = () => 'OK';

const withMiddleware = compose(
  respondToLivenessProbe,
  cors(),
  parseJSONInput,
  isDev && visualize
);

const routes = [options('/graphql', routeOptions), post('/graphql', routeGQL)];

module.exports = withMiddleware(router()(...routes));
