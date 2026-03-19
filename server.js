import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

let isRunning = false;

app.use(express.static('public'));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', isScriptRunning: isRunning });
});

// Trigger the Google script
app.post('/run-google-test', (req, res) => {
  if (isRunning) {
    return res.status(400).json({ error: 'Script is already running' });
  }

  isRunning = true;
  res.json({ message: 'Google test started...', status: 'running' });

  // Run the script asynchronously
  const script = spawn('node', [join(__dirname, 'puppeteer/google-open.js')], {
    cwd: __dirname,
  });

  let output = '';
  let errorOutput = '';

  script.stdout.on('data', (data) => {
    output += data.toString();
    console.log(`[STDOUT] ${data}`);
  });

  script.stderr.on('data', (data) => {
    errorOutput += data.toString();
    console.error(`[STDERR] ${data}`);
  });

  script.on('close', (code) => {
    isRunning = false;
    console.log(`Script exited with code ${code}`);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`POST http://localhost:${PORT}/run-google-test to trigger the script`);
  console.log(`GET http://localhost:${PORT}/health for status`);
});
