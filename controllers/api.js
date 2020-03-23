const shorteners = require('../datasets/shorteners.json');
const trackers = require('../datasets/trackers.json');

class APIController {
  static getRoot(req, res) {
    res.send('Welcome to Mazed API');
  }

  static getShorteners(req, res) {
    res.json(shorteners.hosts);
  }

  static getTrackingParams(req, res) {
    res.json(trackers.params);
  }
}

module.exports = APIController;
