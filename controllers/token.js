class TokenController {
  static renderHome(req, res) {
    res.render('token/home');
  }

  /*
   * This is only for development stage!
   */
  static createToken(req, res) {
    res.send('Hello World');
  }
}

module.exports = TokenController;
