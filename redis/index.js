const redis = require('redis');
const dotenv = require('dotenv');
const path = require('path');
const url = require('url');

const config = require('./config.json');

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

class Redis {
  constructor() {
    const env = process.env.NODE_ENV || 'develpment';
    const { host, port } = config[env];
    const options = { host, port };

    if (config[env].password) options.password = config[env].password;

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
