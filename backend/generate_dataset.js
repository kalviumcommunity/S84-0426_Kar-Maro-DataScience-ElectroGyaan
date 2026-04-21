/**
 * ElectroGyaan AI - Dataset Generator
 * Generates synthetic energy consumption data for training ML models
 */

const fs = require('fs');
const path = require('path');

console.log('🔌 ElectroGyaan AI - Dataset Generator');
console.log('='.repeat(50));

// Configuration
const NUM_FLATS = 50; // A101 to A150
const DAYS = 30; // 30 days of data
const HOURS_PER_DAY = 24;
const SPIKE_PROBABILITY = 0.05; // 5% chance of anomaly

// Generate flat IDs
const flats = Array.from({ length: NUM_FLATS }, (_, i) => `A${101 + i}`);

// Base consumption patterns by hour
function getBaseConsumption(hour) {
  if (hour >= 0 && hour < 6) {
    // Night: 0.3-1.0 kWh
    return 0.3 + Math.random() * 0.7;
  } else if (hour >= 6 && hour < 10) {
    // Morning: 1.5-3.0 kWh
    return 1.5 + Math.random() * 1.5;
  } else if (hour >= 10 && hour < 17) {
    // Daytime: 1.0-2.5 kWh
    return 1.0 + Math.random() * 1.5;
  } else if (hour >= 17 && hour < 23) {
    // Evening: 3.0-5.0 kWh
    return 3.0 + Math.random() * 2.0;
  } else {
    // Late night: 1.0-2.0 kWh
    return 1.0 + Math.random() * 1.0;
  }
}

// Add noise to consumption
function addNoise(value) {
  return Math.max(0.1, value + (Math.random() - 0.5) * 0.3);
}

// Generate dataset
console.log(`\n📊 Generating dataset...`);
console.log(`   Flats: ${NUM_FLATS} (A101-A${100 + NUM_FLATS})`);
console.log(`   Days: ${DAYS}`);
console.log(`   Total records: ${NUM_FLATS * DAYS * HOURS_PER_DAY}`);

const records = [];
const startDate = new Date('2024-06-01T00:00:00');

for (let day = 0; day < DAYS; day++) {
  for (let hour = 0; hour < HOURS_PER_DAY; hour++) {
    for (const flatId of flats) {
      const timestamp = new Date(startDate);
      timestamp.setDate(timestamp.getDate() + day);
      timestamp.setHours(hour);

      const isSpike = Math.random() < SPIKE_PROBABILITY;
      let units_kWh;

      if (isSpike) {
        // Anomaly: 10-15 kWh
        units_kWh = 10 + Math.random() * 5;
      } else {
        // Normal consumption with noise
        units_kWh = addNoise(getBaseConsumption(hour));
      }

      records.push({
        flat_id: flatId,
        timestamp: timestamp.toISOString().replace('T', ' ').replace('.000Z', ''),
        units_kWh: parseFloat(units_kWh.toFixed(3)),
        is_anomaly: isSpike
      });
    }
  }
}

console.log(`✓ Generated ${records.length} records`);

// Calculate statistics
const anomalies = records.filter(r => r.is_anomaly).length;
const anomalyRate = (anomalies / records.length * 100).toFixed(2);
console.log(`   Anomalies: ${anomalies} (${anomalyRate}%)`);

// Convert to CSV
console.log(`\n💾 Writing to CSV...`);
const csvHeader = 'flat_id,timestamp,units_kWh,is_anomaly\n';
const csvRows = records.map(r => 
  `${r.flat_id},${r.timestamp},${r.units_kWh},${r.is_anomaly}`
).join('\n');

const csvContent = csvHeader + csvRows;
const outputPath = path.join(__dirname, 'electrogyaan_dataset.csv');

fs.writeFileSync(outputPath, csvContent);
console.log(`✓ Saved to: ${outputPath}`);
console.log(`   Size: ${(csvContent.length / 1024 / 1024).toFixed(2)} MB`);

console.log('\n' + '='.repeat(50));
console.log('✅ Dataset generation complete!');
console.log('\nNext steps:');
console.log('1. Train models: cd ml-service && python train_models.py');
console.log('2. Start ML service: cd ml-service && uvicorn main:app --reload --port 8000');
console.log('3. Start backend: cd backend && npm run dev');
console.log('4. Start simulator: cd backend && node simulator.js');
console.log('5. Start frontend: cd frontend && npm run dev');
