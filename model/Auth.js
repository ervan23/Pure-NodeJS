const knexfile = require('../knexfile');
const knex = require('knex')(knexfile.development);
const NodeSession = require('node-session');
const config = require('../config/config.js');


const session = new NodeSession({ secret: config.key.session, lifetime: ((300000 * 12) * 24) });

const auth = {
  requestObject: null,
  responseObject: null,
  session(req, res) {
    auth.requestObject = req;
    auth.responseObject = res;

    return auth;
  },
  login(email) {
    const param = {
      email,
    };
    return knex.select().table('tbl_user').where(param).first();
  },
  setData(key, value) {
    session.startSession(auth.requestObject, auth.responseObject, () => {
      auth.requestObject.session.put(key, value);
    });
  },
};

module.exports = auth;
