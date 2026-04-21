const express = require('express');
const router = express.Router();
const energyController = require('../controllers/energyController');

router.post('/api/energy/ingest', energyController.ingestReading);

router.get('/api/energy/history/:flatId', energyController.getHistory);

router.get('/api/energy/predict/:flatId', energyController.getPrediction);

router.get('/api/energy/stats/:flatId', energyController.getStats);

router.get('/api/energy/anomalies/:flatId', energyController.getAnomalies);

router.get('/api/energy/hourly-pattern/:flatId', energyController.getHourlyPattern);

router.get('/api/energy/all-flats', energyController.getAllFlatsStats);

module.exports = router;
