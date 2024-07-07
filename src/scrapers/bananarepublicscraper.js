const axios = require('axios');
const cheerio = require('cheerio');

const baseUrl = 'https://bananarepublic.gap.com';

const scrapeCategoryPage = async (categoryUrl) => {
  try {
    console.log(`Fetching category page: ${categoryUrl}`);
    const { data } = await axios.get(categoryUrl);
    const $ = cheerio.load(data);
    const productLinks = [];

    $('.product-card a').each((index, element) => {
      const relativeLink = $(element).attr('href');
      if (relativeLink) {
        const absoluteLink = `${baseUrl}${relativeLink}`;
        productLinks.push(absoluteLink);
      }
    });

    console.log(`Found ${productLinks.length} product links`);
    return productLinks;
  } catch (error) {
    console.error(`Error scraping category page: ${error}`);
    return [];
  }
};

const scrapeProductPage = async (productUrl) => {
  try {
    console.log(`Fetching product page: ${productUrl}`);
    const { data } = await axios.get(productUrl);
    const $ = cheerio.load(data);

    const title = $('h1.pdp-mfe-119sy63').text().trim();
    const price = $('div.pdp-mfe-tfpyab.product-price__highlight').text().trim();
    const image = $('img.pdp-mfe-xn50hn').attr('src');

    console.log(`Scraped product: ${title}, ${price}, ${image}`);
    return { title, price, image, url: productUrl };
  } catch (error) {
    console.error(`Error scraping product page: ${error}`);
    return null;
  }
};

const scrapeBananaRepublic = async () => {
  const categoryUrl = `${baseUrl}/browse/category.do?cid=1011368`; // Example category page URL
  const productLinks = await scrapeCategoryPage(categoryUrl);
  const items = [];

  for (const productUrl of productLinks) {
    const productDetails = await scrapeProductPage(productUrl);
    if (productDetails) {
      items.push(productDetails);
    }
  }

  console.log(`Scraped ${items.length} products`);
  return items;
};

module.exports = scrapeBananaRepublic;
