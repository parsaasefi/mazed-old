const mysql = require('mysql');

const config = require('../config/database');

class Database {
  constructor() {
    const { host, port, user, password, database } = config;

    this.connection = mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.connection.connect(err => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  }
}

module.exports = new Database();
