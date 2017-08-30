'use strict'

const parseArgs = require('minimist'),
      puppeteer = require('puppeteer');


let options = {
  string: ['url', 'file'],
  boolean: 'local',
  unknown: () => false,
};
let argv = parseArgs(process.argv.slice(2), options);


let browser, page;
return puppeteer.launch().then(br => {
  browser = br;
  return browser.newPage();
}).then(pg => {
  page = pg;
  return page.goto(argv.url);
}).then(() => {
  return page.pdf({
    printBackground: true,
    format: 'A4',
  });
}).then(data => {
  console.log(data);
  browser.close();
});
