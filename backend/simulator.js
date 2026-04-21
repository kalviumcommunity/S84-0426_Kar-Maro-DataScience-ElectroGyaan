require('dotenv').config();
const axios = require('axios');

// All 50 flats A101–A150
const FLATS = Array.from({ length: 50 }, (_, i) => `A${101 + i}`);

const INTERVAL_MS = 5000;       // one full cycle every 5s
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Each flat gets a stable "base multiplier" so they feel like different households
const FLAT_PROFILES = {};
FLATS.forEach(id => {
  FLAT_PROFILES[id] = {
    baseMultiplier: 0.6 + Math.random() * 0.8,   // 0.6x – 1.4x of base
    spikeProbability: 0.03 + Math.random() * 0.07 // 3% – 10% spike chance
  };
});

function getBaseConsumption(hour) {
  if (hour >= 0 && hour < 6)   return 0.3 + Math.random() * 0.7;   // night
  if (hour >= 6 && hour < 10)  return 1.5 + Math.random() * 1.5;   // morning rush
  if (hour >= 10 && hour < 17) return 1.0 + Math.random() * 1.5;   // daytime
  if (hour >= 17 && hour < 23) return 3.0 + Math.random() * 2.0;   // evening peak
  return 1.0 + Math.random() * 1.0;
}

function addNoise(value) {
  return Math.max(0.1, value + (Math.random() - 0.5) * 0.3);
}

function getTimeString() {
  return new Date().toTimeString().split(' ')[0];
}

async function simulateFlat(flatId) {
  const profile = FLAT_PROFILES[flatId];
  const hour = new Date().getHours();
  const isSpike = Math.random() < profile.spikeProbability;

  let units;
  if (isSpike) {
    units = parseFloat((10 + Math.random() * 8).toFixed(3)); // 10–18 kWh spike
  } else {
    units = parseFloat(
      addNoise(getBaseConsumption(hour) * profile.baseMultiplier).toFixed(3)
    );
  }

  try {
    await axios.post(`${BACKEND_URL}/api/energy/ingest`, { flatId, units });

    if (isSpike) {
      console.log(`\x1b[31m⚡ [${getTimeString()}] ${flatId} — ${units.toFixed(3)} kWh — SPIKE\x1b[0m`);
    } else {
      console.log(`\x1b[32m✓  [${getTimeString()}] ${flatId} — ${units.toFixed(3)} kWh\x1b[0m`);
    }
  } catch (error) {
    console.log(`\x1b[33m✗  [${getTimeString()}] ${flatId} ingest failed: ${error.message}\x1b[0m`);
  }
}

async function runCycle() {
  // Send all 50 flats in parallel each cycle
  await Promise.allSettled(FLATS.map(id => simulateFlat(id)));
}

console.log('\x1b[36m🔌 ElectroGyaan IoT Simulator Started\x1b[0m');
console.log(`\x1b[36m   Flats: ${FLATS.length} (${FLATS[0]}–${FLATS[FLATS.length - 1]})\x1b[0m`);
console.log(`\x1b[36m   Cycle interval: ${INTERVAL_MS}ms\x1b[0m`);
console.log(`\x1b[36m   Backend: ${BACKEND_URL}\x1b[0m`);
console.log('');

// Run immediately then every INTERVAL_MS
runCycle();
setInterval(runCycle, INTERVAL_MS);
