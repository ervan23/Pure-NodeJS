const crypto = require('crypto');
const config = require('../config/config.js');

const alg = config.crypter.algorithm;
const chiper = config.crypter.chiper_key;

module.exports = {

  encrypt(text) {
    const cipher = crypto.createCipher(alg, chiper);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  },

  decrypt(text) {
    const decipher = crypto.createDecipher(alg, chiper);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  },
};
