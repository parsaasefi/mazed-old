const events = require('events');

const URIHelper = require('../helpers/uri');

class ProcessController {
  static async getProcessor(req, res) {
    try {
      const eventEmitter = new events.EventEmitter();

      eventEmitter.on('info', uriInfo => {
        res.json(uriInfo);
      });

      const validation = URIHelper.validate(req);

      if (!validation.valid) throw new Error(validation.error);

      const uri = URIHelper.removeWWW(URIHelper.addProtocol(req.query.uri));
      const { update } = req.query;
      const useRedis = !(update && update.toLowerCase() === 'true');

      if (!useRedis) {
        const destination = await URIHelper.follow(uri);
        const safe = true;
        const lastUpdate = Date.now();
        const info = {
          destination,
          safe,
          lastUpdate,
        };

        await req.app.get('redis').addURI(uri, info);
        eventEmitter.emit('info', info);
      } else {
        const redisResult = await req.app.get('redis').getURI(uri);

        if (redisResult) eventEmitter.emit('info', redisResult);
        else {
          const destination = await URIHelper.follow(uri);
          const safe = true;
          const lastUpdate = Date.now();
          const info = {
            destination,
            safe,
            lastUpdate,
          };

          await req.app.get('redis').addURI(uri, info);
          eventEmitter.emit('info', info);
        }
      }
    } catch (err) {
      return res.json({ erros: err.message });
    }

    return true;
  }
}

module.exports = ProcessController;
