
const puppeteer = require('puppeteer');

const logging = require('./logging');


module.exports = {
  async launch() {
    logging.log('[*] Launch browser');

    this.instance = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  },

  async close() {
    logging.log('[*] Close browser');
    await this.instance.close();
  },
};
