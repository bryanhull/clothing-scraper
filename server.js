const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

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

// Function to scrape data from Banana Republic
const scrapeBananaRepublic = async () => {
  try {
    const { data } = await axios.get('https://bananarepublic.gap.com/');
    const $ = cheerio.load(data);
    const items = [];

    $('.product-card').each((index, element) => {
      const title = $(element).find('.product-card__title').text().trim();
      const price = $(element).find('.product-card__price').text().trim();
      const image = $(element).find('.product-card__image img').attr('src');

      console.log({ title, price, image });

      if (title && price && image) {
        items.push({ title, price, image });
      }
    });

    return items;
  } catch (error) {
    console.error(error);
    return [];
  }
};


// Endpoint to get Banana Republic clothing data
app.get('/api/banana-republic', async (req, res) => {
  const items = await scrapeBananaRepublic();
  res.json(items);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
