const knex = require('knex');

const knexfile = require('./knexfile');

const env = process.env.NODE_ENV || 'development';
const config_options = knexfile[env];
module.exports = knex(config_options);
// module.exports = knex({
//   client: 'pg',
//   connection: {
//     host: 'postgres',
//     user: 'postgres',
//     password: 'postgres',
//     database: 'community_feedback_db',
//   },
// });
