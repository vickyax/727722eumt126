import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { fetchAllData, cachedData } from './dataService.js';
import { refreshToken }from './auth.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
const PORT=process.env.PORT;

// Scheduled tasks
cron.schedule('*/5 * * * *', () => {
  console.log('Refreshing data...');
  fetchAllData();
});

cron.schedule('0 */1 * * *', () => {
  refreshToken();
});

// API Endpoints
app.get('/users', (req, res) => {
  res.json(cachedData.stats.topUsers);
});

app.get('/posts', (req, res) => {
  const type = req.query.type === 'popular' ? 'popularPosts' : 'latestPosts';
  res.json(cachedData.stats[type]);
});

// Initialize
(async () => {
  await refreshToken();
  await fetchAllData();
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}/`));
})();