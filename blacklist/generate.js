const fs = require('fs');
const readline = require('readline');

const input = './datasets/blacklist.txt';
const output = './datasets/blacklist.sql';

const table = 'blacklist';
let counter = 1;
let query = `DROP TABLE IF EXISTS ${table}\n
  CREATE TABLE ${table} (id INT AUTO_INCREMENT PRIMARY KEY, host VARCHAR(255))\n
`;

const lineReader = readline.createInterface({
  input: fs.createReadStream(input),
  crlfDelay: Infinity,
});

lineReader.on('line', line => {
  const host = line.slice(1);

  query += `INSERT INTO ${table} (host) VALUES ('${host}')\n`;
  console.log(`[${counter++}] Added ${host}`);
});

lineReader.on('close', () => {
  fs.writeFile(output, query, err => {
    if (err) throw new Error(err);

    console.log('Blacklist.sql has been generated successfully');
  });
});
