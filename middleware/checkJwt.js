const jwksRsa = require('jwks-rsa');
const jwt = require('express-jwt');

const authConfig = {
  domain: 'dev-skxc8k2i.auth0.com',
};

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),

  // audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ['RS256'],
});

module.exports = checkJwt;