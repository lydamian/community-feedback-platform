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
  login: async (req, h) => {
    try {
      const {
        email_address,
        password,
      } = req.payload;
      const auth_token = await auth_interactor.login(email_address, password);
      return h.response({
        error: null,
        status_code: 'USER_LOGIN_OK',
        description: 'user successfully logged in',
        auth_token,
      }).code(201);
    } catch (error) {
      return h.response({
        error: error.message,
        status_code: 'USER_LOGIN_ERROR',
        description: 'error logging in user',
      }).code(201);
    }
  },
  is_authenticated: async (req, h) => {
    try {
      const {
        email_address,
      } = req.auth.credentials;
      console.log(req.auth.credentials);
      return h.response({
        error: null,
        status_code: 'USER_AUTHENTICATED_TRUE',
        description: 'valid authentication token',
        user: {
          email_address,
        },
      }).code(201);
    } catch (error) {
      return h.response({
        error: error.message,
        status_code: 'USER_AUTHENTICATED_FALSE',
        description: 'invalid authentication token',
      }).code(201);
    }
  },
};
