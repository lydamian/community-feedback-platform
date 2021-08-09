const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: '0.0.0.0',
    // SET THIS TO * for development purposes ONLY!!!! should not set this in production
    debug: {
      request: '*',
    },
  });

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

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

init();
