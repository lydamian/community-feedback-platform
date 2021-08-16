const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const C = require('./lib/constants');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: '0.0.0.0',
    // SET THIS TO * for development purposes ONLY!!!! should not set this in production
    debug: {
      request: '*',
    },
  });

  // Declare an authentication strategy using the jwt scheme.
  // Use keys: with a shared secret key OR json web key set uri.
  // Use verify: To determine how key contents are verified beyond signature.
  // If verify is set to false, the keys option is not required and ignored.
  // The verify: { aud, iss, sub } options are required if verify is not set to false.
  // The verify: { exp, nbf, timeSkewSec, maxAgeSec } parameters have defaults.
  // Use validate: To create a function called after token validation.
  await server.register(Jwt);
  server.auth.strategy('jwt-auth-strategy', 'jwt', {
    keys: C.JWT_SHARED_SECRET,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 1000000000000000, // 4 hours
      timeSkewSec: 15,
    },
    validate: (artifacts, request, h) => {
      return {
        isValid: true,
        credentials: {
          email_address: artifacts.decoded.payload.email_address,
          password: artifacts.decoded.payload.password,
        },
      };
    },
  });

  // Set the auth strategy
  server.auth.default('jwt-auth-strategy');

  server.events.on('response', (request) => {
    console.log(`${request.info.remoteAddress}: ${request.method.toUpperCase()} ${request.path} --> ${request.response.statusCode}`);
  });

  server.route(require('./lib/sample/sample-route'));
  server.route(require('./lib/auth/auth-route'));

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
