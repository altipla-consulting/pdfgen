'use strict'

const parseArgs = require('minimist');
const Storage = require('@google-cloud/storage')();
const puppeteer = require('puppeteer');


async function uploadFile(argv, data) {
  let bucket = Storage.bucket(argv.bucket);
  let file = bucket.file(argv.filename);
  let stream = file.createWriteStream({
    metadata: {
      contentType: 'application/pdf',
    },
  });

  console.log(`upload file to storage: gs://${argv.bucket}/${argv.filename}`);
  return new Promise((resolve, reject) => {
    stream.on('error', err => reject(err));
    stream.on('finish', () => resolve());
    stream.end(data);
  });
}


async function main() {
  let options = {
    string: ['url', 'filename', 'bucket', 'authorization'],
    boolean: 'local',
    unknown: () => false,
  };
  let argv = parseArgs(process.argv.slice(2), options);

  if (!argv.url || !argv.bucket || !argv.filename) {
    console.log('Usage: node index.js --url http://www.example.com --bucket test-bucket --filename test/test.pdf [--authorization "Bearer token"]');
    return;
  }

  console.log('launch browser');
  let browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  let page = await browser.newPage();

  page.on('request', request => {
    console.log('request:', request.url);
  });

  page.on('requestfailed', request => {
    console.log('request failed:', request.url);
  });

  if (argv.authorization) {
    await page.setExtraHTTPHeaders({
      'Authorization': `${argv.authorization}`,
    });
  }

  console.log('navigate to url:', argv.url);
  await page.goto(argv.url, {waitUntil: 'load'});

  console.log('print pdf');
  let data = await page.pdf({
    printBackground: true,
    format: 'A4',
  });

  console.log('close browser');
  await browser.close();

  await uploadFile(argv, data);

  console.log('pdgen finished succesfully!');
}


main();
