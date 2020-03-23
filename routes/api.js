const express = require('express');

const APIController = require('../controllers/api');

const router = express.Router();

router.get('/', APIController.getRoot);
router.get('/shorteners', APIController.getShorteners);
router.get('/trackers/params', APIController.getTrackingParams);

module.exports = router;
