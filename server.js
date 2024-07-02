const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Clothing Scraper API');
});

// Example using Cheerio
const scrapeWithCheerio = async () => {
  try {
    const { data } = await axios.get('https://www.staticwebsite.com/');
    const $ = cheerio.load(data);
    const items = [];

    $('.product-card').each((index, element) => {
      const title = $(element).find('.product-card-title').text();
      const price = $(element).find('.product-card-price').text();
      const image = $(element).find('.product-card-image img').attr('src');

      items.push({ title, price, image });
    });

    return items;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Example using Puppeteer
const scrapeWithPuppeteer = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.dynamicwebsite.com/');
    
    const items = await page.evaluate(() => {
      const elements = document.querySelectorAll('.product-card');
      const data = [];
      elements.forEach(element => {
        const title = element.querySelector('.product-card-title').innerText;
        const price = element.querySelector('.product-card-price').innerText;
        const image = element.querySelector('.product-card-image img').src;
        
        data.push({ title, price, image });
      });
      return data;
    });

    await browser.close();
    return items;
  } catch (error) {
    console.error(error);
    return [];
  }
};

app.get('/api/static-site', async (req, res) => {
  const items = await scrapeWithCheerio();
  res.json(items);
});

app.get('/api/dynamic-site', async (req, res) => {
  const items = await scrapeWithPuppeteer();
  res.json(items);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
