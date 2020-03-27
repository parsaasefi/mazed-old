const shorteners = require('../datasets/shorteners.json');
const trackers = require('../datasets/trackers.json');

class APIController {
  static getRoot(req, res) {
    res.send('Welcome to Mazed API');
  }

  static sendShorteners(req, res) {
    res.json(shorteners.hosts);
  }

  static sendTrackingParams(req, res) {
    res.json(trackers.params);
  }
}

module.exports = APIController;
