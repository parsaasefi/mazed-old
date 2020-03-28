const Database = require('./database');

class TokensModel {
  static addToken(token, creation, expiration) {
    return Database.connection.query(
      'INSERT INTO tokens (token, creation, expiration) VALUES (?, ?, ?)',
      [token, creation, expiration]
    );
  }
}

module.exports = TokensModel;
