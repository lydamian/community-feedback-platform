'use strict'

const sample_interactor = require('./sample-interactor');

module.exports = {
  get: async (req, h) => {
    return sample_interactor.get();
  }
}