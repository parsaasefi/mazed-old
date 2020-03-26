const URIHelper = require('./uri');

const Blacklist = require('../models/blacklist');

class SecureHelper {
  static check(uri) {
    const hosts = URIHelper.possibleHosts(uri);

    return new Promise((resolve, reject) => {
      Blacklist.get(hosts)
        .then(res => {
          const result = {};

          if (res.length > 0) {
            result.safe = false;
            result.type = 'blacklist';
          } else {
            result.safe = true;
          }

          resolve(result);
        })
        .catch(err => reject(err));
    });
  }
}

module.exports = SecureHelper;
