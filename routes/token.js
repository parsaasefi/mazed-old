const express = require('express');

const TokenController = require('../controllers/token');

const router = express.Router();

router.get('/', TokenController.renderHome);
router.get('/create', TokenController.createToken);

module.exports = router;
