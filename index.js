'use strict'

const parseArgs = require('minimist'),
      puppeteer = require('puppeteer');


let options = {
  string: ['url', 'file'],
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

  console.log(data);
  browser.close();
}

main();
