const express = require('express');

const IndexController = require('../controllers/index');

const router = express.Router();

router.get('/', IndexController.renderHome);

module.exports = router;
