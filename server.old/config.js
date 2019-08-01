let config = {
  cookieParserSecret: process.env.COOKIE_PARSER_SECRET || '<SECRET>', // secret for cookie parser
  JWTsecret: process.env.JWT_SECRET || '<SECRET>', // secret for JWT
  nodemailerEmail: process.env.NODEMAILER_EMAIL || 'smtp email', // your email client
  nodemailerPw: process.env.NODEMAILER_PW || '<smtp login pw>', // your email password client
  smtp: 'smtp.domain.com', // i.e 'smtp.domain.com'
  mongoUsername: process.env.MONGO_USERNAME || '<mongo username>', // if you have your db
  mongoPw: process.env.MONGO_PW || '<mongo pw>', // if you have your db
  mongoUrl: process.env.MONGO_URL || '<mongo remote server url>',
  server: process.env.SERVER || 'http://localhost:3012', // your backend server
  frontEndServer: process.env.FRONT_END_SERVER || 'http://localhost:3000', // your front end server

  facebookClientId: process.env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  facebookCallbackUrl: process.env.FACEBOOK_CALLBACK_URL,

  contentfulGraphqlEndpoint: process.env.CONTENTFUL_GRAPHQL_ENDPOINT,
  contentfulManagementToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  contentfulContentToken: process.env.CONTENTFUL_CONTENT_TOKEN
};

module.exports = config;
