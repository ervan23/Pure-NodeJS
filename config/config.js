const config = {};

config.db = {
  host: '127.0.0.1',
  user: 'root',
  password: 'yourpassword',
  database: 'yourdb',
};

config.key = {
  postmark: 'yourpostmarkkey',
  session: 'yoursessionkey',
};

config.crypter = {
  algorithm: 'aes-256-ctr',
  chiper_key: 'yourcrypterkey',
};

module.exports = config;
