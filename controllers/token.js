const TokenModel = require('../models/token');
const TokenHelper = require('../helpers/token');

class TokenController {
  static renderHome(req, res) {
    res.render('token/home');
  }

  /*
   * This is only for development stage!
   * This have to be restructured for production
   */
  static async createToken(req, res) {
    try {
      const token = TokenHelper.generateToken();
      const creation = Date.now();
      const expiration = creation + 1000 * 60;

      await TokenModel.addToken(token, creation, expiration);

      res.send(token);
    } catch (err) {
      res.send('Ops...');
    }
  }
}

module.exports = TokenController;
