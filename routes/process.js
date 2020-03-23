const express = require('express');

const ProcessController = require('../controllers/process');

const router = express.Router();

router.get('/', ProcessController.getProcessor);

module.exports = router;
