const { escape } = require('sqlstring');

const database = require('./database');

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

    return database.connection.query(query);
  }
}

module.exports = Blacklist;
