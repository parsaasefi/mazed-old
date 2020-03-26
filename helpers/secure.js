const url = require('url');
const dgadetective = require('dgadetective');

const URIHelper = require('./uri');

const Blacklist = require('../models/blacklist');

class SecureHelper {
  /**
   * Check if a URI is blacklisted or not
   * @param {string} uri the URI to check
   * @returns {boolean} true if the URI is blacklisted
   */
  static isBlacklisted(uri) {
    const hosts = URIHelper.possibleHosts(uri);

    return new Promise((resolve, reject) => {
      Blacklist.get(...hosts)
        .then(res => resolve(res.length > 0))
        .catch(err => reject(err));
    });
  }

  /**
   * Check if a URI is generated using DGA or not
   * @param {string} uri the URI to check
   * @returns {boolean} true if the URI is generated using DGA
   */
  static isDGA(uri) {
    return new Promise((resolve, reject) => {
      const { hostname } = url.parse(uri);
      dgadetective
        .checkDGA(hostname)
        .then(score => resolve(score > 100))
        .catch(err => reject(err));
    });
  }

  /**
   * Check if a URI is secure or not
   * @param {string} uri the URI to check
   * @returns {object} reports the result
   */
  static check(uri) {
    return new Promise((resolve, reject) => {
      this.isBlacklisted(uri)
        .then(res => {
          if (res) {
            const result = {
              safe: false,
              type: 'blacklist',
            };

            return resolve(result);
          }

          return uri;
        })
        .then(uri => this.isDGA(uri))
        .then(res => {
          if (res) {
            const result = {
              safe: false,
              type: 'dga',
            };

            return resolve(result);
          }

          return resolve({ safe: true });
        })
        .catch(err => reject(err));
    });
  }
}

module.exports = SecureHelper;
