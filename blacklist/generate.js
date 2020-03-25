const fs = require('fs');
const readline = require('readline');
const path = require('path');
const Datastore = require('nedb');

const input = path.join(__dirname, 'dataset/blacklist.txt');
const database = path.join(__dirname, 'database/blacklist.db');
const hosts = [];

const lineReader = readline.createInterface({
  input: fs.createReadStream(input),
  crlfDelay: Infinity,
});

lineReader.on('line', line => {
  const data = {
    host: line.slice(1),
  };
  hosts.push(data);
});

lineReader.on('close', () => {
  const blacklist = new Datastore({
    filename: database,
    autoload: true,
  });

  blacklist.insert(hosts, err => {
    if (err) {
      throw new Error(err);
    }

    console.log('Blacklist database has been generated successfully.');
  });
});
