const redis = require('redis');
const url = require('url');

const config = require('../config/redis');

class Redis {
  constructor() {
    const { host, port } = config;
    const options = { host, port };

    if (config.password) options.password = config.password;

    this.client = redis.createClient(options);
    this.expireTime = 10; // Seconds
  }

  addURI(uri, info) {
    return new Promise((resolve, reject) => {
      const { hostname, pathname } = url.parse(uri);

      this.client.setex(
        hostname + pathname,
        this.expireTime,
        JSON.stringify(info),
        (err, res) => {
          if (err) return reject(err);

          return resolve(res);
        }
      );
    });
  }

  getURI(uri) {
    return new Promise((resolve, reject) => {
      const { hostname, pathname } = url.parse(uri);

      this.client.get(hostname + pathname, (err, res) => {
        if (err) return reject(err);

        return resolve(JSON.parse(res));
      });
    });
  }
}

module.exports = Redis;
