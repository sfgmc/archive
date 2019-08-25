require('dotenv').config();

// micro-specific plugins
const { send } = require('micro');
const cors = require('micro-cors');
const { router, post, options } = require('micro-fork');
const {
  compose,
  respondToLivenessProbe,
  parseJSONInput
} = require('micro-hoofs');
const visualize = require('micro-visualize');

// for user authentication
const ManagementClient = require('auth0').ManagementClient;

// for generic api calls
const request = require('request-promise-native');

// for query destructuring and filtering
const graphql2json = require('graphql-operation-to-pojo');
const { jsonToGraphQLQuery: json2graphql } = require('json-to-graphql-query');

// set up auth0 endpoint for token querying
const auth0Endpoint = `https://${process.env.AUTH0_ACCOUNT}.auth0.com`;
const auth0 = new ManagementClient({
  domain: `${process.env.AUTH0_ACCOUNT}.auth0.com`,
  clientId: process.env.AUTH0_MANAGEMENT_ID,
  clientSecret: process.env.AUTH0_MANAGEMENT_sECRET,
  scope: 'read:users'
});

const isDev = process.env.NODE_ENV !== 'production';

// POST - /graphql
const routeGQL = async (req, res) => {
  console.log('hitting route', auth0);

  // Auth phase
  const auth0Token =
    req.headers.authorization && req.headers.authorization.split('Bearer ')[1];

  let userInfo;
  let permissions = [];
  if (auth0Token) {
    userInfo = await request.get(`${auth0Endpoint}/userinfo`, {
      json: true,
      auth: {
        bearer: auth0Token
      }
    });
    permissions = await auth0.getUserPermissions({ id: userInfo.sub });
  }
  permissions = permissions.map(p => p.permission_name);
  console.log(userInfo, permissions);

  // Redaction phase
  // we have permissions now, parse and alter request to make
  // sure we're only sending out authorized data

  // Prepare request stage
  let ctType = 'CONTENT';
  // upgrade ctType here if profile calls for it
  if (
    permissions.includes('archive:contributor') ||
    permissions.includes('archive:admin')
  ) {
    ctType = 'MANAGEMENT';
  }

  const configVar = `CONTENTFUL_${ctType}_TOKEN`;

  // Request stage
  let results;
  try {
    results = await request.post(process.env.CONTENTFUL_GRAPHQL_ENDPOINT, {
      json: req.json,
      auth: {
        bearer: process.env[configVar]
      }
    });
  } catch (e) {
    console.log(e);
    return send(res, e.statusCode, e.error);
  }

  // Verify stage
  // double check results one more time

  // Return stage
  return results;
};

// OPTIONS - /graphql
const routeOptions = () => 'OK';

// general middleware for all routes
const withMiddleware = compose(
  respondToLivenessProbe,
  cors(),
  parseJSONInput,
  isDev && visualize
);

// individual route definitions
const routes = [options('/graphql', routeOptions), post('/graphql', routeGQL)];

// final server export
module.exports = withMiddleware(router()(...routes));
