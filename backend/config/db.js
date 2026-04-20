import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Defaulting to local MongoDB database if no URL is provided in .env
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/electrogyaan';
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
