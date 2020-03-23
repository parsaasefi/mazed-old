const { validationResult } = require('express-validator');

class ProcessController {
  static getProcessor(req, res) {
    const validatorErrors = validationResult(req);

    if (!validatorErrors.errors()) {
      return res.json({ errors: validatorErrors.array() });
    }

    return true;
  }
}

module.exports = ProcessController;
