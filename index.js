const sharpImages = require('./spectrum/sharp.js');
const { crawlerSong } = require('./spectrum/crawler.js');

// sharpImage()

const URL = 'http://www.17jita.com/tab/top100.html'

crawlerSong('后来', URL);