const axios = require('axios');
const cheerio = require('cheerio');

const baseUrl = 'https://www.ralphlauren.com';

const scrapeCategoryPage = async (categoryUrl) => {
  try {
    console.log(`Fetching category page: ${categoryUrl}`);
    const { data } = await axios.get(categoryUrl);
    const $ = cheerio.load(data);
    const productLinks = [];

    // Adjust selector to match the actual HTML structure of the category page
    $('a.product-card__link').each((index, element) => {
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

    const title = $('h1.product-name').text().trim();
    const price = $('span.product-price').text().trim();
    const image = $('img.product-image__main').attr('src');

    console.log(`Scraped product: ${title}, ${price}, ${image}`);
    return { title, price, image, url: productUrl };
  } catch (error) {
    console.error(`Error scraping product page: ${error}`);
    return null;
  }
};

const scrapeRalphLauren = async () => {
  const categoryUrl = `${baseUrl}/men-clothing-shop-new-arrivals-cg?webcat=men%7Cfeature%7CNew%20Arrivals`; // Category page URL
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

module.exports = scrapeRalphLauren;
