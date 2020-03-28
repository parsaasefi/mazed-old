const { escape } = require('sqlstring');

const Database = require('./database');

class BlacklistModel {
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

    return Database.connection.query(query);
  }
}

module.exports = BlacklistModel;
