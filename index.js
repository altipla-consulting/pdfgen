
const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const timestamp = require('console-timestamp');


const TIMESTAMP_FORMAT = '[YYYY-MM-DD hh:mm:ss:iii]';


const app = express();
app.use(bodyParser.json());


async function print(res, input) {
  let headersSent = false;
  try {
    console.log(`${timestamp(TIMESTAMP_FORMAT)} [*] Launch puppeteer`);
    let browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    let page = await browser.newPage();
    page.on('request', request => console.log(`${timestamp(TIMESTAMP_FORMAT)} -- request: ${request.url()}`));

    let failed = false;
    page.on('requestfailed', request => {
      failed = true;
      console.error(`${timestamp(TIMESTAMP_FORMAT)} -- request failed: ${request.url()}`);

      if (!headersSent) {
        headersSent = true;
        res.json({error: `request failed: ${request.url()}`});
      }
    });

    console.log(`${timestamp(TIMESTAMP_FORMAT)} [*] Navigate to page`);
    await page.goto(input.url, {
      timeout: 25000,
      waitUntil: ['networkidle0', 'load'],
    });

    let pdf;
    if (!failed) {
      console.log(`${timestamp(TIMESTAMP_FORMAT)} [*] Generate PDF`);
      pdf =  await page.pdf({
        printBackground: true,
        format: 'A4',
      });
    }

    console.log(`${timestamp(TIMESTAMP_FORMAT)} [*] Close browser`);
    await browser.close();

    if (!failed) {
      res.type('pdf');
      res.send(pdf);
    }
  } catch (err) {
    console.error(`${timestamp(TIMESTAMP_FORMAT)} PDF generation failed:`, err);
    if (!headersSent) {
      headersSent = true;
      res.json({error: `${err}`});
    }
  }
}


app.get('/', (req, res) => res.send('Use the API to generate a PDF'));

app.post('/api', (req, res) => {
  let input = req.body;
  console.log(`${timestamp(TIMESTAMP_FORMAT)} === Request received\n===`, input);

  if (!input.url) {
    res.json({error: 'url required'});
    return;
  }

  print(res, input).catch(err => {
    console.error(`${timestamp(TIMESTAMP_FORMAT)} ${err}`);
    res.json({error: err});
  });
});


let server = app.listen(3000, () => console.log(`${timestamp(TIMESTAMP_FORMAT)} App listening on port 3000!`));

process.on('SIGINT', function() {
  server.close();
  process.exit(0);
});
