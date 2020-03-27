const url = require('url');
const { validationResult } = require('express-validator');

const URIHelper = require('../helpers/uri');
const SecurityHelper = require('../helpers/security');

class ProcessController {
  static validateProcess(req, res, next) {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.render('process/error');
    }

    const uri = URIHelper.removeWWW(URIHelper.addProtocol(req.query.uri));

    // if (!URIHelper.isShortened(uri)) {
    //   return res.render('process/error');
    // }

    req.uri = uri;
    return next();
  }

  static async processURI(req, res, next) {
    try {
      const { uri } = req;
      const { update, rp } = req.query;
      const useRedis = !(update && update.toLowerCase() === 'true');
      const removeParams = !(rp && rp.toLowerCase() === 'false');

      if (!useRedis) {
        const destination = await URIHelper.follow(uri);
        const security = await SecurityHelper.check(destination);
        const lastUpdate = Date.now();
        const info = {
          shortURI: uri,
          destination,
          security,
          lastUpdate,
        };

        await req.app.get('redis').addURI(uri, info);

        info.destination = removeParams
          ? URIHelper.removeTrackingParamas(destination)
          : destination;

        req.uriInfo = info;
        next();
      } else {
        const redisResult = await req.app.get('redis').getURI(uri);

        if (redisResult) {
          const { destination } = redisResult;

          redisResult.destination = removeParams
            ? URIHelper.removeTrackingParamas(destination)
            : destination;

          req.uriInfo = redisResult;
          next();
        } else {
          const destination = await URIHelper.follow(uri);
          const security = await SecurityHelper.check(destination);
          const lastUpdate = Date.now();
          const info = {
            shortURI: uri,
            destination,
            security,
            lastUpdate,
          };

          await req.app.get('redis').addURI(uri, info);

          info.destination = removeParams
            ? URIHelper.removeTrackingParamas(destination)
            : destination;

          req.uriInfo = info;
          next();
        }
      }
    } catch (err) {
      return res.render('process/error');
    }

    return true;
  }

  static giveAccessToken(req, res, next) {
    const { uriInfo } = req;
    const {
      destination,
      shortURI,
      security: { isSafe },
    } = uriInfo;

    if (URIHelper.sameHost(destination, shortURI) && isSafe) {
      const parsedURI = url.parse(destination, true);

      parsedURI.query['mazed-access-token'] = Date.now();
      parsedURI.search = '';

      const uriWithToken = url.format(parsedURI);
      return res.redirect(uriWithToken);
    }

    return next();
  }

  static sendProcessResult(req, res) {
    const { uriInfo } = req;
    const { destination } = uriInfo;

    if (!uriInfo.security.isSafe) {
      const message = 'This URI is not safe!';

      return res.render('process/warning', {
        destination,
        message,
      });
    }

    return res.render('process/success', {
      destination,
    });
  }
}

module.exports = ProcessController;
