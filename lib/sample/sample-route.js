'use strict';

const sample_handler = require('./sample-handler');

module.exports = [
{
  method: 'GET',
  path: '/api/sample',
  handler: sample_handler.get,
},
];