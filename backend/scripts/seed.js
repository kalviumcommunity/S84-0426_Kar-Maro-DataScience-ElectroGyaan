import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import EnergyData from '../models/EnergyData.js';

// Load environment variables
dotenv.config();

const NUM_USERS = 50;
const DAYS_TO_SEED = 30;
const HOURS_PER_DAY = 24;

/**
 * Generate synthetic energy data based on time of day.
 * - Base load (~0.5 kWh) during the night/midday
 * - Morning Peak (7 AM - 9 AM) (~2.5 kWh)
 * - Evening Peak (6 PM - 10 PM) (~4.0 kWh)
 * Added random noise (±10%) to make it look realistic.
 */
function generateHourlyUsage(hour) {
  let base;
  if (hour >= 7 && hour <= 9) {
    base = 2.5; // Morning peak
  } else if (hour >= 18 && hour <= 22) {
    base = 4.0; // Evening peak
  } else {
    base = 0.5; // Base load
  }
  
  // Add some random variance (±20%)
  const variance = base * 0.2;
  const noise = (Math.random() * variance * 2) - variance;
  
  return Math.max(0, parseFloat((base + noise).toFixed(3)));
}

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing EnergyData...');
    await EnergyData.deleteMany({});

    console.log(`🌱 Generating data for ${NUM_USERS} users over ${DAYS_TO_SEED} days...`);
    const records = [];
    const now = new Date();
    
    // We start from `DAYS_TO_SEED` days ago
    for (let u = 1; u <= NUM_USERS; u++) {
      const userId = `user-${u.toString().padStart(3, '0')}`;
      
      for (let day = DAYS_TO_SEED; day >= 1; day--) {
        for (let hour = 0; hour < HOURS_PER_DAY; hour++) {
          // Calculate the timestamp for this specific hour
          const timestamp = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - day,
            hour,
            0,
            0
          );

          records.push({
            userId,
            timestamp,
            units_kWh: generateHourlyUsage(hour),
            isAnomaly: false
          });
        }
      }
    }

    console.log(`📦 Inserting ${records.length} records into the database...`);
    // Use insertMany for bulk insertion performance
    await EnergyData.insertMany(records);

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
