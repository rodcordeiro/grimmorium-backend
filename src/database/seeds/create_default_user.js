const { v4 } = require('uuid');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(async function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: v4(),
          username: 'admin',
          email: 'admin@rodcordeiro.com',
          password:
            '$2a$10$a9i8DdwkykV.4DFMEyQQdePDYhRFFYzLTA8VHcP2Rwaf/Ng8Z6Op6',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
      ]);
    });
};
