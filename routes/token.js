const express = require('express');

const TokenController = require('../controllers/token');

const router = express.Router();

router.get('/', TokenController.renderHome);

module.exports = router;
