require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const connectDB = require('./config/db');
const energyRoutes = require('./routes/energyRoutes');
const authRoutes = require('./routes/authRoutes');
const EnergyData = require('./models/EnergyData');

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

console.log('\x1b[36m[CORS] Allowed origins:\x1b[0m', allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('\x1b[33m[CORS] Blocked origin:\x1b[0m', origin);
      callback(null, true); // Allow anyway for development
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'backend',
    timestamp: new Date().toISOString()
  });
});

app.use('/', energyRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error('\x1b[31m[ERROR]\x1b[0m', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

cron.schedule('0 0 * * *', async () => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const result = await EnergyData.deleteMany({
      timestamp: { $lt: sevenDaysAgo }
    });
    console.log(`\x1b[36m[CRON] Cleaned ${result.deletedCount} old records\x1b[0m`);
  } catch (error) {
    console.error('\x1b[31m[CRON ERROR]\x1b[0m', error.message);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\x1b[36m🚀 ElectroGyaan Backend running on port ${PORT}\x1b[0m`);
  console.log(`\x1b[36m   Health check: http://localhost:${PORT}/health\x1b[0m`);
  console.log(`\x1b[36m   Environment: ${process.env.NODE_ENV || 'development'}\x1b[0m`);
});
