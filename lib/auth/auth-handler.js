const auth_interactor = require('./auth-interactor');

module.exports = {
  register: async (req, h) => {
    try {
      const user_id = await auth_interactor.register(req.payload);
      return h.response({
        error: null,
        status_code: 'USER_REGISTERED_OK',
        description: 'user registered successfully',
        user_id,
      }).code(201);
    } catch (error) {
      return h.response({
        error: error.message,
        status_code: 'USER_REGISTERED_ERROR',
        description: 'error registering user',
      }).code(201);
    }
  },
  login: async (req, h) => auth_interactor.login(),
};
