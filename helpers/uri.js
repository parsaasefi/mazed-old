const url = require('url');
const followRedirect = require('follow-redirect-url');
const { validationResult } = require('express-validator');

const shorteners = require('../datasets/shorteners.json');

class URIHelper {
  /**
   * Validate the process request
   * @param {object} req Request object from process controller
   * @returns {object} if valid is false, there will be an error message
   */
  static validate(req) {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty)
      return {
        valid: false,
        error: 'URI_IS_NOT_VALID',
      };

    const uri = this.removeWWW(this.addProtocol(req.query.uri));

    if (!this.isShortened(uri))
      return {
        valid: false,
        error: 'URI_IS_NO_SHORTENED',
      };

    return {
      valid: true,
    };
  }

  /**
   * Add protocol to URI if it doesn't already have
   * @param {string} uri URI which is going to get added protocol
   * @returns {string} URI with protocol
   */
  static addProtocol(uri) {
    const pattern = /^http/i;
    return pattern.test(uri) ? uri : `https://${uri}`;
  }

  /**
   * Check if a URI is shortened using hosts from shorteners dataset
   * @param {string} uri URI to check if is shortened
   * @returns {string} true if the URI is shortened
   */
  static isShortened(uri) {
    const { hostname } = url.parse(uri);
    const { hosts } = shorteners;
    return hosts.includes(hostname);
  }

  /**
   * Remove www from the beginning of the URI host
   * @param {string} uri URI to remove www from
   * @returns {string} URI without www
   */
  static removeWWW(uri) {
    const parsedURI = url.parse(uri);
    const { hostname } = parsedURI;

    if (hostname.split('.')[0] === 'www') {
      parsedURI.hostname = hostname.split('.').slice(1).join('.');
      parsedURI.host = parsedURI.hostname;
    }

    return url.format(parsedURI);
  }

  /**
   * Follow URI redirects
   * @param {string} uri URI to follow its redirects
   * @returns {Promise} The last destination
   */
  static follow(uri) {
    return followRedirect
      .startFollowing(uri)
      .then(urls => urls.slice(-1)[0].url);
  }

  /**
   * Get all possible hosts from an URI
   * @param {string} uri URI to extract hosts
   * @returns {array} An array containing all possible hosts
   */
  static possibleHosts(uri) {
    const { hostname } = url.parse(uri);
    const splittedHost = hostname.split('.');
    const hosts = [hostname];

    if (splittedHost.length >= 3) {
      for (let i = 1; i < splittedHost.length - 1; i++) {
        hosts.push(splittedHost.slice(i).join('.'));
      }
    }

    return hosts;
  }
}

module.exports = URIHelper;
