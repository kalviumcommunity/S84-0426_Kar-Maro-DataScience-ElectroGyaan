import express from 'express';
import { ingestEnergyData, getUsers, getEnergyData } from '../controllers/energyController.js';

const router = express.Router();

router.get('/users', getUsers);
router.post('/ingest', ingestEnergyData);
router.get('/:userId', getEnergyData);

export default router;
