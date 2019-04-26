const sharpImages = require('./spectrum/sharp.js');
const { crawlerTop100 } = require('./spectrum/crawler.js');

// sharpImage()

const URL = 'http://www.17jita.com/tab/topic/top100.html'

crawlerTop100(URL);