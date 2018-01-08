const knexfile = require('../knexfile');
const knex = require('knex')(knexfile.development);
const crypter = require('../middleware/crypter.js');

const token = {
  id: null,
  token: '',
  expired: '',
  insert() {
    const now = new Date();
    const param = {
      token: token.token,
      expired: new Date(now.setHours(now.getHours() + 2)),
    };
    return knex('tbl_token').insert(param).returning('id');
  },
  get() {
    return knex('tbl_token').where('id', token.id).first();
  },
  generate(text) {
    return crypter.encrypt(text);
  },

  parse(text) {
    return crypter.decrypt(text);
  },
};

module.exports = token;
