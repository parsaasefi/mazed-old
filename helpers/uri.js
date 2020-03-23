const url = require('url');

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
}

module.exports = URIHelper;
