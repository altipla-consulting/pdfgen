'use strict'

const parseArgs = require('minimist'),
      Storage = require('@google-cloud/storage'),
      puppeteer = require('puppeteer');


let options = {
  string: ['url', 'filename', 'bucket'],
  boolean: 'local',
  unknown: () => false,
};
let argv = parseArgs(process.argv.slice(2), options);


async function main() {
  let browser = await puppeteer.launch();
  let page = await browser.newPage();
  await page.goto(argv.url)

  let data = await page.pdf({
    printBackground: true,
    format: 'A4',
  });

  browser.close();

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

  stream.on('error', (err) => {
    throw err;
  });

  stream.on('finish', () => {
    console.log('finished');
  });

  stream.end(data);
}

main();
