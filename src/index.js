
const express = require('express');
const bodyParser = require('body-parser');

const logging = require('./logging');
const browser = require('./browser');


const app = express();

app.use(bodyParser.json({limit: '50mb'}));

app.get('/', (req, res) => res.send('Use the API to generate a PDF'));
app.get('/health', (req, res) => res.send('ok'));
app.post('/api', require('./api'));


let server;
browser.launch().then(() => {
  server = app.listen(3000, () => logging.log('App listening on port 3000!'));
});


process.on('SIGINT', function() {
  if (server) {
    server.close();
  }

  browser.close().then(() => {
    process.exit(0);
  });
});
