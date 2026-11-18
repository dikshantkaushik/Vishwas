import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

// Simple automated diagnostic script to test API endpoints
async function runTests() {
  console.log('--- Starting Backend Verification Tests ---');

  // Dynamically import server components
  const { default: express } = await import('express');
  const { default: cors } = await import('cors');
  const { connectDB, isDBConnected } = await import('./src/config/db.js');
  const { default: agreementRoutes } = await import('./src/routes/agreementRoutes.js');

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'Vishwas Micro-Agreement API',
      database: {
        connected: isDBConnected(),
        status: isDBConnected() ? 'connected' : 'disconnected',
      },
    });
  });

  app.use('/api/agreements', agreementRoutes);

  // Attempt DB connection
  console.log('[Test 1] Testing MongoDB Connection...');
  const dbConnected = await connectDB();
  console.log(`[Test 1 Result] DB Connected: ${dbConnected} (isDBConnected: ${isDBConnected()})`);

  // Start HTTP server on test port 5055
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5055, resolve));
  console.log('[Test 2] Test HTTP Server listening on port 5055');

  // Test /api/health
  console.log('[Test 3] Testing GET /api/health ...');
  const healthRes = await fetch('http://127.0.0.1:5055/api/health');
  const healthData = await healthRes.json();
  console.log('[Test 3 Result] Health Response:', JSON.stringify(healthData));

  // Test /api/agreements (Graceful handling test if DB offline or live data test if DB online)
  console.log('[Test 4] Testing GET /api/agreements ...');
  const agrRes = await fetch('http://127.0.0.1:5055/api/agreements');
  const agrData = await agrRes.json();
  console.log('[Test 4 Result] Status:', agrRes.status, 'Response:', JSON.stringify(agrData));

  // Test POST /api/agreements validation
  console.log('[Test 5] Testing POST /api/agreements validation (empty body)...');
  const postRes = await fetch('http://127.0.0.1:5055/api/agreements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const postData = await postRes.json();
  console.log('[Test 5 Result] Status:', postRes.status, 'Response:', JSON.stringify(postData));

  // Clean shutdown
  server.close();
  console.log('--- Verification Complete ---');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
