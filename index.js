
const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');


const app = express();
app.use(bodyParser.json());


async function print(res, input) {
  try {
    console.log('[*] Launch puppeteer');
    let browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    let page = await browser.newPage();
    page.on('request', request => console.log(`-- request: ${request.url()}`));

    let failed = false;
    page.on('requestfailed', request => {
      failed = true;
      throw new Error(`request failed: ${request.url()}`);
    });

    console.log('[*] Navigate to page');
    await page.goto(input.url, {
      timeout: 25000,
      waitUntil: ['networkidle0', 'load'],
    });

    console.log('[*] Generate PDF');
    let pdf =  await page.pdf({
      printBackground: true,
      format: 'A4',
    });

    console.log('[*] Close browser')
    await browser.close();

    res.type('pdf');
    res.send(pdf);
  } catch (err) {
    console.error('PDF generation failed:', err);
    res.json({error: `${err}`});
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


let server = app.listen(3000, () => console.log('App listening on port 3000!'));

process.on('SIGINT', function() {
  server.close();
  process.exit(0);
});
