const express = require('express');
const { check } = require('express-validator');

const ProcessController = require('../controllers/process');

const router = express.Router();

router.get(
  '/',
  [check('uri').isURL()],
  ProcessController.validateProcess,
  ProcessController.processURI,
  ProcessController.giveAccessToken,
  ProcessController.sendProcessResult
);

module.exports = router;
