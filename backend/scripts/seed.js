import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import EnergyData from '../models/EnergyData.js';
import User from '../models/User.js';
import { fileURLToPath } from 'url';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const CSV_FILE_PATH = path.join(__dirname, '../../ml-service/data/electrogyaan_dataset - electrogyaan_dataset.csv');

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing EnergyData and Users...');
    await EnergyData.deleteMany({});
    await User.deleteMany({});

    const recordsByFlat = {};
    const flatIds = new Set();

    console.log('📖 Reading CSV data...');
    await new Promise((resolve, reject) => {
      fs.createReadStream(CSV_FILE_PATH)
        .pipe(csv())
        .on('data', (data) => {
          const flatId = data.flat_id;
          if (!flatId) return; // Skip empty rows
          
          flatIds.add(flatId);
          if (!recordsByFlat[flatId]) {
            recordsByFlat[flatId] = [];
          }
          
          recordsByFlat[flatId].push({
            units_kWh: parseFloat(data.units_kWh) || 0,
            isAnomaly: data.is_anomaly === 'TRUE' || data.is_anomaly === 'true'
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });

    const uniqueFlats = Array.from(flatIds);
    console.log(`✅ Found ${uniqueFlats.length} unique flats.`);

    console.log('🔐 Generating secure users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('12345678', salt);

    const usersToInsert = [];

    // 1. Create one Admin User
    usersToInsert.push({
      name: 'Admin',
      email: 'admin@electrogyaan.com',
      password: hashedPassword,
      role: 'admin'
    });

    // 2. Create Flat Users
    for (const flatId of uniqueFlats) {
      usersToInsert.push({
        name: flatId,
        email: `${flatId.toLowerCase()}@gmail.com`,
        password: hashedPassword,
        role: 'user'
      });
    }

    await User.insertMany(usersToInsert);
    console.log(`✅ Inserted ${usersToInsert.length} users successfully!`);

    console.log('⏳ Shifting timestamps to 30 days from now and mapping records...');
    const energyRecordsToInsert = [];
    const now = new Date();
    // Set minutes and seconds to 0 to align to exact hours
    now.setMinutes(0, 0, 0);

    for (const flatId of uniqueFlats) {
      const records = recordsByFlat[flatId];
      const totalRecords = records.length;
      
      // We want to span 30 days exactly (720 hours)
      const targetRecords = Math.min(totalRecords, 30 * 24);
      const startIndex = totalRecords - targetRecords;

      for (let i = 0; i < targetRecords; i++) {
        // Shift time backwards from now, up to 720 hours ago
        const hoursAgo = targetRecords - 1 - i;
        const timestamp = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
        
        const record = records[startIndex + i];

        energyRecordsToInsert.push({
          userId: flatId, // This maps correctly so Admin Dashboard displays "A101"
          timestamp: timestamp,
          units_kWh: record.units_kWh,
          isAnomaly: record.isAnomaly
        });
      }
    }

    console.log(`📦 Bulk inserting ${energyRecordsToInsert.length} energy records...`);
    // Insert in batches of 5000 to prevent memory exhaustion
    const batchSize = 5000;
    for (let i = 0; i < energyRecordsToInsert.length; i += batchSize) {
      const batch = energyRecordsToInsert.slice(i, i + batchSize);
      await EnergyData.insertMany(batch);
      console.log(`   - Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(energyRecordsToInsert.length/batchSize)}`);
    }

    console.log('✅ Entire Database Seeding from CSV completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed:`, error);
    process.exit(1);
  }
};

seedData();
