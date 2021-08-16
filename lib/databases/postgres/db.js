const knex = require('knex');

const knexfile = require('./knexfile');

const env = process.env.NODE_ENV || 'development';
const config_options = knexfile[env];
module.exports = knex(config_options);
