import axios from 'axios';

const NUM_USERS = 50;
const INTERVAL_MS = 10000; // Generate data every 10 seconds -> simulating 1 hour

// The backend must be running for this simulator to hit its API
const INGEST_API_URL = 'http://localhost:5000/api/energy/ingest';

// Simulate realistic hour-of-day progression. Starts at hour 0 (Midnight).
let currentSimulatedHour = 0;

function generateHourlyUsage(hour) {
  let base;
  if (hour >= 7 && hour <= 9) {
    base = 2.5; // Morning peak
  } else if (hour >= 18 && hour <= 22) {
    base = 4.0; // Evening peak
  } else {
    base = 0.5; // Base load
  }
  
  const variance = base * 0.2;
  const noise = (Math.random() * variance * 2) - variance;
  let usage = Math.max(0, parseFloat((base + noise).toFixed(3)));

  // Random arbitrary spike (3% chance) for the ML model to catch as anomaly
  if (Math.random() < 0.03) {
    usage = parseFloat((usage * (Math.random() * 3 + 2)).toFixed(3)); // 2x to 5x spike
  }

  return usage;
}

const simulateRealTimeData = async () => {
  console.log(`⏱️ Starting Simulator: 1 hour in simulation = ${INTERVAL_MS/1000} seconds real-time...`);

  setInterval(async () => {
    console.log(`\n⏳ Simulating Hour: ${currentSimulatedHour}`);
    let successes = 0;

    // Fire 50 asynchronous requests to the INGEST API
    const requests = [];
    
    for (let u = 1; u <= NUM_USERS; u++) {
      const userId = `user-${u.toString().padStart(3, '0')}`;
      const units_kWh = generateHourlyUsage(currentSimulatedHour);
      
      const simulateTime = new Date(); // Stamp it with current real time

      requests.push(
        axios.post(INGEST_API_URL, {
          userId,
          units_kWh,
          timestamp: simulateTime
        }).then(() => successes++).catch(err => console.error(`[${userId}] Error: ${err.message}`))
      );
    }

    await Promise.all(requests);
    console.log(`✅ Ingested ${successes}/${NUM_USERS} records. Next payload in ${INTERVAL_MS/1000}s.`);

    // Progress the simulated hour.
    currentSimulatedHour = (currentSimulatedHour + 1) % 24;

  }, INTERVAL_MS);
};

simulateRealTimeData();
