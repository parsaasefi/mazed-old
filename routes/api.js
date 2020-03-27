const express = require('express');

const APIController = require('../controllers/api');

const router = express.Router();

router.get('/', APIController.getRoot);
router.get('/shorteners', APIController.sendShorteners);
router.get('/trackers/params', APIController.sendTrackingParams);

module.exports = router;
