const url = require('url');
const { validationResult } = require('express-validator');
const { format } = require('timeago.js');

const URIHelper = require('../helpers/uri');
const SecurityHelper = require('../helpers/security');

class ProcessController {
  static validateProcess(req, res, next) {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.render('process/error');
    }

    req.uri = URIHelper.removeWWW(URIHelper.addProtocol(req.query.uri));
    return next();
  }

  static async processURI(req, res, next) {
    try {
      const { uri } = req;
      const { update, rp, redirect } = req.query;
      const useCache = !(update && update.toLowerCase() === 'true');
      const removeParams = !(rp && rp.toLowerCase() === 'false');
      const autoRedirect = redirect && redirect.toLowerCase() === 'true';

      req.autoRedirect = autoRedirect;

      if (useCache) {
        const redisResult = await req.app.get('redis').getURI(uri);

        if (redisResult) {
          const { destination } = redisResult;

          redisResult.destination = removeParams
            ? URIHelper.removeTrackingParamas(destination)
            : destination;

          req.uriInfo = redisResult;
          return next();
        }
      }

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
      return next();
    } catch (err) {
      return res.render('process/error');
    }
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
    const { uriInfo, autoRedirect } = req;
    const { destination, lastUpdate } = uriInfo;

    if (!uriInfo.security.isSafe) {
      const message = 'This URI is not safe!';

      return res.render('process/warning', {
        destination,
        lastUpdate: format(lastUpdate),
        message,
      });
    }

    if (autoRedirect) {
      return res.redirect(destination);
    }

    return res.render('process/success', {
      destination,
      lastUpdate: format(lastUpdate),
    });
  }
}

module.exports = ProcessController;
