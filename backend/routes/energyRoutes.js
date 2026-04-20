import express from 'express';
import { ingestEnergyData, getUsers, getEnergyData, getAlerts } from '../controllers/energyController.js';

const router = express.Router();

router.get('/users', getUsers);
router.post('/ingest', ingestEnergyData);
router.get('/:userId', getEnergyData);
router.get('/:userId/alerts', getAlerts);

export default router;
