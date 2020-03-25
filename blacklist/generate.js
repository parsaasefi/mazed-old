const fs = require('fs');
const readline = require('readline');
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');

const config = require('../config/config.json');

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const table = 'blacklist';
const input = path.join(__dirname, 'dataset/blacklist.txt');
const env = process.env.NODE_ENV || 'development';
const { host, port, username: user, password, database } = config[env];
const connection = mysql.createConnection({
  host,
  port,
  user,
  password,
  database,
});

connection.connect(connectionError => {
  if (connectionError) {
    throw new Error(connectionError);
  }

  const lineReader = readline.createInterface({
    input: fs.createReadStream(input),
    crlfDelay: Infinity,
  });

  const linesPerQuery = 100;
  let query = '';
  let counter = 1;

  query += `DROP TABLE IF EXISTS ${table};`;
  query += `CREATE TABLE ${table} (id INT AUTO_INCREMENT PRIMARY KEY, host VARCHAR(255));`;

  lineReader.on('line', line => {
    const newQuery = `INSERT INTO ${table} (host) VALUES ('${line.slice(1)}');`;

    if (query.split(';').length < linesPerQuery) {
      query += newQuery;
    } else {
      const queryToImport = query;
      query = newQuery;

      connection.query(queryToImport, queryError => {
        if (queryError) {
          throw new Error(queryError);
        }

        console.log(`Added pack number ${counter++}`);
      });
    }
  });
});
