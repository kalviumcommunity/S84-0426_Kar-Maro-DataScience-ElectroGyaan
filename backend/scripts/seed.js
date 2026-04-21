require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const EnergyData = require('../models/EnergyData');

const MONGO_URI = process.env.MONGO_URI;
const FLATS = Array.from({ length: 50 }, (_, i) => `A${101 + i}`);
const HOURS_OF_HISTORY = 24;

// Unique base multiplier per flat so each has a different consumption profile
const FLAT_PROFILES = {};
FLATS.forEach(id => {
  FLAT_PROFILES[id] = {
    baseMultiplier: 0.6 + Math.random() * 0.8,
    spikeProbability: 0.03 + Math.random() * 0.07
  };
});

function getBaseConsumption(hour) {
  if (hour >= 0 && hour < 6)   return 0.3 + Math.random() * 0.7;
  if (hour >= 6 && hour < 10)  return 1.5 + Math.random() * 1.5;
  if (hour >= 10 && hour < 17) return 1.0 + Math.random() * 1.5;
  if (hour >= 17 && hour < 23) return 3.0 + Math.random() * 2.0;
  return 1.0 + Math.random() * 1.0;
}

function addNoise(v) {
  return Math.max(0.1, v + (Math.random() - 0.5) * 0.3);
}

async function seed() {
  console.log('\x1b[36m🌱 ElectroGyaan Seed Script\x1b[0m');
  console.log(`\x1b[36m   Connecting to MongoDB...\x1b[0m`);

  await mongoose.connect(MONGO_URI);
  console.log('\x1b[32m✓ Connected\x1b[0m');

  // Remove old data for all 50 flats
  const deleted = await EnergyData.deleteMany({ flatId: { $in: FLATS } });
  console.log(`\x1b[33m  Cleared ${deleted.deletedCount} old records\x1b[0m`);

  const records = [];
  const now = Date.now();

  for (const flatId of FLATS) {
    const profile = FLAT_PROFILES[flatId];

    // One reading per 5 minutes for HOURS_OF_HISTORY hours = 288 readings per flat
    const totalReadings = (HOURS_OF_HISTORY * 60) / 5;

    for (let i = totalReadings; i >= 0; i--) {
      const timestamp = new Date(now - i * 5 * 60 * 1000);
      const hour = timestamp.getHours();
      const isSpike = Math.random() < profile.spikeProbability;

      let units_kWh;
      if (isSpike) {
        units_kWh = parseFloat((10 + Math.random() * 8).toFixed(3));
      } else {
        units_kWh = parseFloat(
          addNoise(getBaseConsumption(hour) * profile.baseMultiplier).toFixed(3)
        );
      }

      records.push({
        flatId,
        timestamp,
        units_kWh,
        isAnomaly: isSpike,
        mlConfidence: isSpike ? parseFloat((0.7 + Math.random() * 0.3).toFixed(2)) : null
      });
    }
  }

  console.log(`\x1b[36m  Inserting ${records.length} records for ${FLATS.length} flats...\x1b[0m`);

  // Batch insert in chunks of 5000
  const BATCH = 5000;
  for (let i = 0; i < records.length; i += BATCH) {
    await EnergyData.insertMany(records.slice(i, i + BATCH), { ordered: false });
    process.stdout.write(`\r\x1b[32m  Inserted ${Math.min(i + BATCH, records.length)} / ${records.length}\x1b[0m`);
  }

  console.log('\n\x1b[32m✓ Seed complete!\x1b[0m');
  console.log(`\x1b[36m  ${FLATS.length} flats × ~${(HOURS_OF_HISTORY * 60) / 5} readings = ${records.length} total records\x1b[0m`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('\x1b[31m✗ Seed failed:\x1b[0m', err.message);
  process.exit(1);
});
