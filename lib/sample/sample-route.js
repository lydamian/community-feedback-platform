'use strict';

const Joi = require('joi');
const sample_handler = require('./sample-handler');

module.exports = [
{
  method: 'GET',
  path: '/api/sample',
  handler: sample_handler.get,
  options: {
    validate: {
      query: Joi.object({
        name: Joi.string().min(3).max(10).optional()
      })
    }
  }
},
];