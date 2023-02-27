const express = require('express');
const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

var lastUrl = "none"

// Function to scrape text from a URL
const scrapeTextFromUrl = async (url) => {
  try {
    const html = await rp(url);
    const $ = cheerio.load(html);
    const text = $('p').text();
    return text;
  } catch (error) {
    console.error(`Error scraping ${url}: ${error}`);
  }
}

// Function to scrape URLs from a URL
const scrapeUrlsFromUrl = async (url) => {
  try {
    const html = await rp(url);
    const $ = cheerio.load(html);
    const links = $('a');
    const urls = [];
    links.each((i, link) => {
      const href = $(link).attr('href');
      if (href && href.startsWith('http') && href.includes('en.')) {
        urls.push(href);
      }
    });
    return urls;
  } catch (error) {
    console.error(`Error scraping ${url}: ${error}`);
  }
}

// Function to scrape text and URLs from a URL
const scrape = async (url) => {
  try {
    const scrapedText = await scrapeTextFromUrl(url);
    const scrapedUrls = await scrapeUrlsFromUrl(url);
    return { text: scrapedText, urls: scrapedUrls };
  } catch (error) {
    console.error(`Error scraping ${url}: ${error}`);
  }
}

app.get('/scrape', (req, res) => {
  const html = `
    <html>
        <head>
          <style>
            body {
              font-family: Arial, Helvetica, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background-color: #161717;
              color: white;
            }
            div {
              display: flex;
              flex-direction: column;
              align-items: center;
            }

            input[type=text] {
            width: 100%;
            padding: 15px 32px;
            margin: 15px 0;
            box-sizing: border-box;
            border: 2px solid blue;
            border-radius: 10px;
            }

            button {
              background-color: #4CAF50; /* Green */
              border: none;
              color: white;
              padding: 15px 32px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 16px;
              border-radius: 10px;
              width: 100%;
            }
          </style>
        </head>
        <body>
        <div>
          <h1>Enter URL to scrape</h1>
          <br>
          <form action="/scrape" method="post">
            <input type="text" id="url" name="url">
            <button type="submit">Scrape</button>
          </form>
          <br>
          <p>Last scraped url: ${lastUrl} </p>
          </div>
        </body>
      </html>
  `;
  res.send(html);
});

app.post('/scrape', async (req, res) => {
  const url = req.body.url;
  try {
    const { text, urls } = await scrape(url);
    lastUrl = url;
    fs.appendFileSync('./src/text.txt', text + '\n');
    res.redirect('/scrape');
    console.log(`Scraped ${url} and added to text.txt`);
  } catch (error) {
    console.error(`Error scraping ${url}: ${error}`);
    res.status(500).send(`Error scraping ${url}`);
  }
}); 

// app.get('/scrape/:url(*)', async (req, res) => {
//   const url = req.params.url;
//   try {
//     const { text, urls } = await scrape(url);
//     fs.appendFileSync('./src/text.txt', text + '\n\n');
//     fs.appendFileSync('./src/urls.txt', JSON.stringify(urls) + '\n\n');
//     res.send(`Scraped ${url} and added to text.txt`);
//     console.log(`Scraped ${url} and added to text.txt`);
//   } catch (error) {
//     console.error(`Error scraping ${url}: ${error}`);
//     res.status(500).send(`Error scraping ${url}`);
//   }
// });

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
