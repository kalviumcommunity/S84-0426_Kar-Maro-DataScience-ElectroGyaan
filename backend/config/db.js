const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`\x1b[32m✓ MongoDB Connected: ${conn.connection.host}\x1b[0m`);
    console.log(`\x1b[32m  Database: ${conn.connection.name}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m✗ MongoDB Connection Error: ${error.message}\x1b[0m`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('\x1b[33m⚠ MongoDB disconnected. Attempting to reconnect...\x1b[0m');
});

mongoose.connection.on('reconnected', () => {
  console.log('\x1b[32m✓ MongoDB reconnected successfully\x1b[0m');
});

mongoose.connection.on('error', (err) => {
  console.error(`\x1b[31m✗ MongoDB error: ${err.message}\x1b[0m`);
});

module.exports = connectDB;
