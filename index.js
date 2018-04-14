
const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');


const app = express();
app.use(bodyParser.json());


async function print(res, input) {
  console.log('[*] Launch puppeteer');
  let browser = await puppeteer.launch();
  let page = await browser.newPage();

  page.on('request', request => console.log(`-- request: ${request.url()}`));

  let failed = false;
  page.on('requestfailed', request => {
    failed = true;
    console.error(`-- request failed: ${request.url()}`);
    res.json({error: `request failed: ${request.url()}`});
  });

  let pdf;
  try {
    console.log('[*] Navigate to page');
    await page.goto(input.url, {
      timeout: 25000,
      waitUntil: ['networkidle0', 'load'],
    });

    console.log('[*] Generate PDF');
    pdf =  await page.pdf({
      printBackground: true,
      format: 'A4',
    });
  } catch (err) {
    failed = true;
    console.error('PDF generation failed:', err);
    res.json({error: `${err}`});
  }

  console.log('[*] Close browser')
  await browser.close();

  if (!failed) {
    res.type('pdf');
    res.send(pdf);
  }
}


app.get('/', (req, res) => res.send('Use the API to generate a PDF'));

app.post('/api', (req, res) => {
  let input = req.body;
  console.log('=== Request received\n===', input);

  if (!input.url) {
    res.json({error: 'url required'});
    return;
  }

  print(res, input).catch(err => {
    console.error(err);
    res.json({error: err});
  });
});

app.listen(3000, () => console.log('App listening on port 3000!'));
