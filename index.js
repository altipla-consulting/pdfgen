
const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');


const app = express();
app.use(bodyParser.json());


async function print(res, input) {
  let browser = await puppeteer.launch();
  let page = await browser.newPage();

  let pdf = await page.goto(input.url, {
    waitUntil: 'networkidle0',
    printBackground: true,
  });

  await browser.close();

  res.send('Hello World!');
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



// 'use strict'

// const parseArgs = require('minimist');
// const Storage = require('@google-cloud/storage')();
// const puppeteer = require('puppeteer');


// async function uploadFile(argv, data) {
//   let bucket = Storage.bucket(argv.bucket);
//   let file = bucket.file(argv.filename);
//   let stream = file.createWriteStream({
//     metadata: {
//       contentType: 'application/pdf',
//     },
//   });

//   console.log(`upload file to storage: gs://${argv.bucket}/${argv.filename}`);
//   return new Promise((resolve, reject) => {
//     stream.on('error', err => reject(err));
//     stream.on('finish', () => resolve());
//     stream.end(data);
//   });
// }


// async function main() {
//   let options = {
//     string: ['url', 'filename', 'bucket', 'user', 'password'],
//     boolean: 'local',
//     unknown: () => false,
//   };
//   let argv = parseArgs(process.argv.slice(2), options);

//   if (!argv.url || !argv.bucket || !argv.filename) {
//     console.log('Usage: node index.js --url http://www.example.com --bucket test-bucket --filename test/test.pdf [--user username --password passw]');
//     return;
//   }

//   console.log('launch browser');
//   let browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
//   let page = await browser.newPage();

//   page.on('request', request => {
//     console.log('request:', request.url);
//   });

//   page.on('requestfailed', request => {
//     console.log('request failed:', request.url);
//   });

//   if (argv.user && argv.password) {
//     page.authenticate({
//       username: argv.user,
//       password: argv.password,
//     })
//   }

//   console.log('navigate to url:', argv.url);
//   await page.goto(argv.url, {waitUntil: 'load'});

//   console.log('print pdf');
//   let data = await page.pdf({
//     printBackground: true,
//     format: 'A4',
//   });

//   console.log('close browser');
//   await browser.close();

//   await uploadFile(argv, data);

//   console.log('pdgen finished succesfully!');
// }


// main();
