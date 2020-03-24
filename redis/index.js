const redis = require('redis');
const dotenv = require('dotenv');
const path = require('path');

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
  }
}
