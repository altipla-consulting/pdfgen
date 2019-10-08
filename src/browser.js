
const puppeteer = require('puppeteer-core');

const logging = require('./logging');


module.exports = {
  async launch() {
    logging.log('[*] Launch browser');

    this.instance = await puppeteer.launch({
      executablePath: 'google-chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
  },

  async close() {
    logging.log('[*] Close browser');
    await this.instance.close();
  },
};
