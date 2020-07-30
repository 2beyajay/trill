const express = require('express');

const callController = require('../controllers/callController')


const router = express.Router();

router.get('/', callController.getCall)

router.post('/', callController.postCall)

router.get('/loading', callController.getLoading)

router.get('/charts', callController.getCharts)

module.exports = router;