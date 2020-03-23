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
}

module.exports = URIHelper;
