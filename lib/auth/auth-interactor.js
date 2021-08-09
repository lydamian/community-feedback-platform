const { pg_community_feedback } = require('../databases/connections');

module.exports = {
  register: async (payload) => {
    const result = await pg_community_feedback.select('*').from('community_user');
    console.log(result);
  },
  login: async () => 'Lets log you in!',
};
