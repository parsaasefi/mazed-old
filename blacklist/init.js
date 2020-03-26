const fs = require('fs');
const readline = require('readline');
const path = require('path');
const dotenv = require('dotenv');
const mariadb = require('mariadb');

const config = require('../config/config.json');

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const table = 'blacklist';
const inputFile = path.join(__dirname, 'dataset/blacklist.txt');
const env = process.env.NODE_ENV || 'development';
const { host, port, username: user, password, database } = config[env];

const pool = mariadb.createPool({
  host,
  port,
  user,
  password,
  database,
  connectionLimit: 5,
});

const seedDB = async () => {
  const connection = await pool.getConnection();

  await connection.query(`DROP TABLE IF EXISTS ${table}`);
  await connection.query(
    `CREATE TABLE ${table} (id INT AUTO_INCREMENT PRIMARY KEY, host VARCHAR(255));`
  );

  let data = [];
  const limit = 10000;
  const lineReader = readline.createInterface({
    input: fs.createReadStream(inputFile),
    crlfDelay: Infinity,
  });

  lineReader.on('line', line => {
    const hostname = line.slice(1);

    if (data.length < limit) {
      return data.push([hostname]);
    }

    const dataToInsert = data;
    data = [[hostname]];

    return connection
      .batch(`INSERT INTO ${table} (host) VALUES (?)`, dataToInsert)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  });

  lineReader.on('close', async () => {
    if (data.length > 0) {
      await connection.batch(`INSERT INTO ${table} (host) VALUES (?)`, data);
    }

    const res = await connection.query(`SELECT COUNT(host) FROM ${table}`);
    console.log(res);
  });

  return connection;
};

seedDB()
  .then(connection => connection.release())
  .catch(err => console.log(err));
