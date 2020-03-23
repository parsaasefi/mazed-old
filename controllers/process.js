const { validationResult } = require('express-validator');
const events = require('events');

const URIHelper = require('../helpers/uri');

class ProcessController {
  static async getProcessor(req, res) {
    const eventEmitter = new events.EventEmitter();

    /*
     * Listener to handle the given information
     */
    eventEmitter.on('info', info => {
      res.json(info);
    });

    /*
     * Listener to handle the errors
     */
    eventEmitter.on('error', err => {
      res.json({ errors: err });
    });

    /*
     * All the validations
     */
    const validatorErrors = validationResult(req);

    if (!validatorErrors.isEmpty()) {
      return eventEmitter.emit('error', validatorErrors.array());
    }

    const uri = URIHelper.removeWWW(URIHelper.addProtocol(req.query.uri));
    const forceUpdate =
      req.query.update && req.query.update.toLowerCase() === 'true';

    if (!URIHelper.isShortened(uri)) {
      return eventEmitter.emit('error', 'IS_NOT_SHORTENED');
    }

    /*
     * Don't use Redis cache if forceUpdate is set to true
     */
    if (forceUpdate) {
      const destination = await URIHelper.follow(uri);
      const safe = true;
      const lastUpdate = Date.now();
      const info = {
        destination,
        safe,
        lastUpdate,
      };

      eventEmitter.emit('info', info);
    }

    return true;
  }
}

module.exports = ProcessController;
