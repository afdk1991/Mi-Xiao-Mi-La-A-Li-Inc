import app from './app.js';
import initDatabase from './config/database.js';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 3000;

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

async function start() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API Health check: http://localhost:${PORT}/api/health`);
  });
}

start().catch(console.error);
