const { validationResult } = require('express-validator');
const events = require('events');

class ProcessController {
  static getProcessor(req, res) {
    const eventEmitter = new events.EventEmitter();

    eventEmitter.on('info', (info) => {
      res.send('Cool');
    });

    eventEmitter.on('error', (err) => {
      res.json({ errors: err });
    });

    const validatorErrors = validationResult(req);

    if (!validatorErrors.isEmpty()) {
      return eventEmitter.emit('error', validatorErrors.array());
    }

    return res.send('Cool!');
  }
}

module.exports = ProcessController;
