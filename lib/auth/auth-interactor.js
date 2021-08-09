const auth_model = require('./auth-model');

module.exports = {
  register: async (payload) => auth_model.create_user(payload),
  login: async () => 'Lets log you in!',
};
