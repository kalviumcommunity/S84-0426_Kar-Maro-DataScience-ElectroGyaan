import express from 'express';
import { ingestEnergyData } from '../controllers/energyController.js';

const router = express.Router();

router.post('/ingest', ingestEnergyData);

export default router;
