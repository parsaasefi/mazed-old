const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

const config = require('../config/database');

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

class Database {
  constructor() {
    this.connection = null;
  }

  async init() {
    await this.connect();
    if (process.env.NODE_ENV === 'development') await this.dropTables();
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

  dropTables() {
    const tokensTable = 'DROP TABLE IF EXISTS tokens';
    const queries = [];

    queries.push(this.connection.query(tokensTable));
    return Promise.all(queries);
  }

  createTables() {
    const tokensTable =
      'CREATE TABLE IF NOT EXISTS tokens (id INT AUTO_INCREMENT PRIMARY KEY, token VARCHAR(255), creation INT, expiration INT)';
    const queries = [];

    queries.push(this.connection.query(tokensTable));
    return Promise.all(queries);
  }
}

module.exports = new Database();
