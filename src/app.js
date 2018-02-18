// we use require as opposed to 'import' here
// so Node can run this file as well
const Idler = require('./idler');
const HtmlLogger = require('./html-logger');


// choose if we log to console or html doc
let log;
if (typeof window === 'object') {
  const logger = new HtmlLogger('#app');
  log = logger.log.bind(logger);
} else {
  log = console.log;
}

// start it up
const idler = new Idler(2, log);
idler.start();