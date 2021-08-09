const auth_interactor = require('./auth-interactor');

module.exports = {
  register: async (req, h) => {
    const result = auth_interactor.register(req.payload);
    return h.response({
      error: null,
      status_code: 'USER_REGISTERED_OK',
      description: 'user registered successfully',
    }).code(201);
  },
  login: async (req, h) => {
    return auth_interactor.login()
  },
};
