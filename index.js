'use strict'

const parseArgs = require('minimist');
const Storage = require('@google-cloud/storage');
const puppeteer = require('puppeteer');


async function uploadFile(argv, data) {
  let gsoptions = {};
  if (!argv.local)  {
    gsoptions.keyFilename = '/etc/service-account.json';
  }

  let storage = Storage(gsoptions);

  let bucket = storage.bucket(argv.bucket);
  let file = bucket.file(argv.filename);
  let stream = file.createWriteStream({
    metadata: {
      contentType: 'application/pdf',
    },
  });

  return new Promise((resolve, reject) => {
    stream.on('error', err => reject(err));

    stream.on('finish', () => resolve());

    stream.end(data);
  });
}


async function main() {
  let options = {
    string: ['url', 'filename', 'bucket'],
    boolean: 'local',
    unknown: () => false,
  };
  let argv = parseArgs(process.argv.slice(2), options);

  if (!argv.url || !argv.bucket || !argv.filename) {
    console.log('Usage: node index.js --url http://www.example.com --bucket test-bucket --filename test/test.pdf');
    return;
  }

  let browser = await puppeteer.launch();
  let page = await browser.newPage();
  await page.goto(argv.url)

  let data = await page.pdf({
    printBackground: true,
    format: 'A4',
  });

  browser.close();

  await uploadFile(argv, data);
}

main();
