
const timestamp = require('console-timestamp');
const toArray = require('lodash/toArray');


const TIMESTAMP_FORMAT = '[YYYY-MM-DD hh:mm:ss:iii]';


module.exports = {
  log() {
    let args = toArray(arguments);
    args.unshift(timestamp(TIMESTAMP_FORMAT));
    console.log.apply(console, args);
  },

  error() {
    let args = toArray(arguments);
    args.unshift(timestamp(TIMESTAMP_FORMAT));
    console.error.apply(console, args);
  },
}
