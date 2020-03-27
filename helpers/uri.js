const url = require('url');
const followRedirect = require('follow-redirect-url');

const shorteners = require('../datasets/shorteners.json');
const trackers = require('../datasets/trackers.json');

class URIHelper {
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

  /**
   * Compare two URIs to see if the have the same host or not
   * @param {string} uriA First URI
   * @param {string} uriB Second URI
   * @returns {boolean} true if they have the same host
   */
  static sameHost(uriA, uriB) {
    const parsedURIA = url.parse(this.removeWWW(uriA));
    const parsedURIB = url.parse(this.removeWWW(uriB));

    return parsedURIA.hostname === parsedURIB.hostname;
  }

  /**
   * Remove all known tracking params from the given URI
   * @param {string} uri URI to remove tracking params from
   * @returns {string} Clean URI
   */
  static removeTrackingParamas(uri) {
    const parsedURI = url.parse(uri, true);
    const trackingParams = trackers.params;

    for (const param of Object.keys(parsedURI.query)) {
      if (trackingParams.includes(param.toLowerCase())) {
        delete parsedURI.query[param];
        parsedURI.search = '';
      }
    }

    const cleanURI = url.format(parsedURI);
    return cleanURI;
  }
}

module.exports = URIHelper;
