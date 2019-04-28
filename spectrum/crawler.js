const http = require('http');
const request = require('request');
const fs = require('fs');
const iconv = require('iconv-lite');
const jsdom = require("jsdom");

const { JSDOM } = jsdom;

/**
 * 函数-发起请求加载页面
 * @param {String} url 
 */
const fetchDocument = url => 
  new Promise((resolve, reject) => {
    http.get(url, res => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];
      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
      } else if (!/^text\/html/.test(contentType)) {
        error = new Error('Invalid content-type.\n' + `Expected application/html but received ${contentType}`);
      }
      if (error) {
        reject(error.message);
        res.resume();
        return;
      }
      let html = '';
      res.setEncoding('binary');
      res.on('data', chunk => { html += chunk; });
      res.on('end', () => {
        try {
          resolve(iconv.decode(Buffer.from(html, 'binary'), 'GBK'));
        } catch (e) {
          reject(e.message);
        }
      });
    }).on('error', e => {
      reject(`Got error: ${e.message}`);
    });
  })

/**
 * 函数-从网页中清洗出图片信息
 * @param {String} html 网页字符串
 */
const filterImgUrl = html => {
  let imgs = new Array();
  new JSDOM(html).window.document.querySelectorAll('#article_contents img')
    .forEach(img =>
      imgs.push({
        name: img.alt.replace(/\s/ig,'_'),
        url: img.src,
        modify: new Date().toISOString()
      })
    )
  return imgs;
}

/**
 * 函数-从网页中清洗出曲谱地址合集
 * @param {String} html 网页字符串
 */
const filterSongsList = html => {
  let songs = new Array();
  new JSDOM(html).window.document.querySelectorAll('a')
    .forEach(song => {
      const songID = song.href.split('/').pop().split('.')[0];
      songs.push({
        id: songID,
        name: song.textContent.replace(/\s/ig,'_'),
        url: `http://www.17jita.com/tab/whole_${songID}.html`
      })
    })
  return songs;
}

/**
 * 爬取-Top100 曲谱集合并存储至指定文件夹
 */
const crawlerClassic132 = async () => {
  const html = fs.readFileSync('./spectrum/classic132.html', 'utf8');
  const songs = filterSongsList(html);
  for (let index = 0; index < songs.length; index++) {
    const { name, url }  = songs[index];
    const msg = await crawlerSong(name, url);
    console.log('😄：' + msg + '【' + name + '】');
  }
}

/**
 * 爬取-指定曲谱所有图片并存储至指定文件夹
 * @param {String} name 
 * @param {String} url 
 */
const crawlerSong = async (name, url) => {
  const html = await fetchDocument(url);
  const imgs = filterImgUrl(html);
  const baseUrl = `./spectrum/classic132`;
  fs.existsSync(baseUrl) || fs.mkdirSync(baseUrl);
  const path = `${baseUrl}/${name}`;
  fs.existsSync(path) || fs.mkdirSync(path);
  return new Promise((resolve, reject) => {
    Promise.all(imgs.map((img, index) => crawlerImg(`${path}/${img.name}_${index}.jpg`, img.url)))
      .then(value => resolve(value))
      .catch(reason => reject('🚑' + reason))
  })
}

/**
 * 爬取-指定图片
 * @param {String} name 
 * @param {String} url 
 */
const crawlerImg = async (name, url) => {
  return new Promise((resolve, reject) => {
    request(url)
      .on('error', err => reject('❎' + err.stack))
      .pipe(
        fs.createWriteStream(name)
          .on('finish', () => resolve('☑️'))
          .on('error', err => reject('❎' + err.stack))
      );
  })
}


module.exports = {
  crawlerSong,
  crawlerClassic132
};

