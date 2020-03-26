const { escape } = require('sqlstring');

const database = require('./database').connection;

class Blacklist {
  static get(...hosts) {
    let query = 'SELECT * FROM blacklist WHERE ';
    let counter = 0;

    for (const host of hosts) {
      query += `host=${escape(host)} `;
      counter++;

      if (counter >= 1 && counter < hosts.length) {
        query += 'OR ';
      }
    }

    return new Promise((resolve, reject) => {
      database.query(query, (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(res);
      });
    });
  }
}

module.exports = Blacklist;
