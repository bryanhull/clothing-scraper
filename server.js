const express = require('express');
const cors = require('cors');
const scrapeBananaRepublic = require('./src/scrapers/bananarepublicscraper.js');
const scrapeRalphLauren = require('./src/scrapers/ralphlaurenscraper.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Clothing Scraper API');
});

// Test endpoint
app.get('/test', (req, res) => {
  res.send('Test endpoint is working');
});

// Endpoint to get Banana Republic clothing data
app.get('/api/banana-republic', async (req, res) => {
  const items = await scrapeBananaRepublic();
  res.json(items);
});

// Endpoint to get Ralph Lauren clothing data
app.get('/api/ralph-lauren', async (req, res) => {
  const items = await scrapeRalphLauren();
  res.json(items);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
