const mysql = require('mysql2/promise');

const config = require('../config/database');

class Database {
  constructor() {
    this.connection = null;
  }

  async init() {
    await this.connect();
    return this.createTables();
  }

  connect() {
    const { host, port, user, password, database } = config;

    return new Promise((resolve, reject) => {
      mysql
        .createConnection({
          host,
          port,
          user,
          password,
          database,
        })
        .then(connection => {
          this.connection = connection;
          return resolve();
        })
        .catch(err => reject(err));
    });
  }

  createTables() {
    const tokensTable = `CREATE TABLE IF NOT EXISTS tokens (id INT AUTO_INCREMENT PRIMARY KEY, token VARCHAR(255))`;
    const queries = [];

    queries.push(this.connection.query(tokensTable));
    return Promise.all(queries);
  }
}

module.exports = new Database();
