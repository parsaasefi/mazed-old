const _ = require('lodash');

class TokenHelper {
  static generateToken() {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
    const shuffledChars = _.shuffle(chars.split(''));
    const tokenSize = 20;
    const tokenChars = [];

    for (let i = 0; i < tokenSize; i++) {
      const randomChar = _.sample(shuffledChars);
      tokenChars.push(randomChar);
    }

    return tokenChars.join('');
  }
}

module.exports = TokenHelper;
