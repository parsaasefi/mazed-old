const events = require('events');

const URIHelper = require('../helpers/uri');

class ProcessController {
  static async getProcessor(req, res) {
    try {
      const eventEmitter = new events.EventEmitter();

      eventEmitter.on('info', uriInfo => {
        res.json(uriInfo);
      });

      eventEmitter.on('error', err => {
        throw new Error(err);
      });

      const validation = URIHelper.validate(req);

      if (!validation.valid)
        return eventEmitter.emit('error', validation.error);

      const uri = URIHelper.removeWWW(URIHelper.addProtocol(req.query.uri));
      const { update } = req.query;
      const useRedis = !(update && update.toLowerCase() === 'true');

      if (!useRedis) {
        try {
          const destination = await URIHelper.follow(uri);
          const safe = true;
          const lastUpdate = Date.now();
          const info = {
            destination,
            safe,
            lastUpdate,
          };

          eventEmitter.emit('info', info);
        } catch (err) {
          eventEmitter.emit('error', err);
        }
      }
    } catch (err) {
      return res.json({ erros: err.message });
    }

    return true;
  }
}

module.exports = ProcessController;
