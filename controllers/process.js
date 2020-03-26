const events = require('events');

const URIHelper = require('../helpers/uri');
const SecureHelper = require('../helpers/secure');

class ProcessController {
  static async getProcessor(req, res) {
    try {
      const eventEmitter = new events.EventEmitter();

      eventEmitter.on('info', uriInfo => {
        if (!uriInfo.security.isSafe) {
          return res.render('process/warning', {
            destination: uriInfo.destination,
            message: 'This is a message to exmplain wtf is going on',
          });
        }

        return res.render('process/success', {
          destination: uriInfo.destination,
        });
      });

      const validation = URIHelper.validate(req);

      if (!validation.valid) throw new Error(validation.error);

      const uri = URIHelper.removeWWW(URIHelper.addProtocol(req.query.uri));
      const { update } = req.query;
      const useRedis = !(update && update.toLowerCase() === 'true');

      if (!useRedis) {
        const destination = await URIHelper.follow(uri);
        const security = await SecureHelper.check(destination);
        const lastUpdate = Date.now();
        const info = {
          destination,
          security,
          lastUpdate,
        };

        await req.app.get('redis').addURI(uri, info);
        eventEmitter.emit('info', info);
      } else {
        const redisResult = await req.app.get('redis').getURI(uri);

        if (redisResult) eventEmitter.emit('info', redisResult);
        else {
          const destination = await URIHelper.follow(uri);
          const security = await SecureHelper.check(destination);
          const lastUpdate = Date.now();
          const info = {
            destination,
            security,
            lastUpdate,
          };

          await req.app.get('redis').addURI(uri, info);
          eventEmitter.emit('info', info);
        }
      }
    } catch (err) {
      return res.render('process/error');
    }

    return true;
  }
}

module.exports = ProcessController;
