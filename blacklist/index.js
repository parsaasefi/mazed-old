const Datastore = require('nedb');
const path = require('path');

class Blacklist {
  constructor() {
    this.blacklist = new Datastore({
      filename: path.join(__dirname, 'database/blacklist.db'),
    });
  }

  load() {
    return new Promise((resolve, reject) => {
      this.blacklist.loadDatabase(err => {
        if (err) {
          return reject(err);
        }

        return resolve(true);
      });
    });
  }
}

module.exports = Blacklist;
