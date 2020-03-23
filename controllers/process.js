const { validationResult } = require('express-validator');
const events = require('events');

const URIHelper = require('../helpers/uri');

class ProcessController {
  static getProcessor(req, res) {
    const eventEmitter = new events.EventEmitter();

    // Listener to handle the given information
    eventEmitter.on('info', info => {
      res.send(info);
    });

    // Listener to handle the errors
    eventEmitter.on('error', err => {
      res.json({ errors: err });
    });

    const validatorErrors = validationResult(req);

    if (!validatorErrors.isEmpty()) {
      return eventEmitter.emit('error', validatorErrors.array());
    }

    const uri = URIHelper.removeWWW(URIHelper.addProtocol(req.query.uri));

    return res.send(uri);
  }
}

module.exports = ProcessController;
