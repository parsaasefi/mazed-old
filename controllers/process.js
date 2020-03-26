const events = require('events');
const url = require('url');

const URIHelper = require('../helpers/uri');
const SecureHelper = require('../helpers/secure');

class ProcessController {
  static async getProcessor(req, res) {
    try {
      const eventEmitter = new events.EventEmitter();

      eventEmitter.on('info', uriInfo => {
        const { destination, shortURI } = uriInfo;

        /*
         * If the destination and the short URI, have the same host,
         * it means that the URI is not being redirected.
         * So we add a Token to the destination and redirect the user
         * to the new URI. In the extension, if the Token was valid,
         * the user won't be redirected.
         */
        if (URIHelper.sameHost(destination, shortURI)) {
          const parsedURI = url.parse(shortURI, true);

          parsedURI.query['mazed-access-token'] = Date.now();
          parsedURI.search = '';

          const uriWithToken = url.format(parsedURI);
          return res.redirect(uriWithToken);
        }

        if (!uriInfo.security.isSafe) {
          const message = 'This is a message to explain wtf is going on';

          return res.render('process/warning', {
            destination,
            message,
          });
        }

        return res.render('process/success', {
          destination,
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
          shortURI: uri,
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
            shortURI: uri,
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
