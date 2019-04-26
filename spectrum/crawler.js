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
          resolve(iconv.decode(new Buffer(html, 'binary'), 'GBK'));
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
        name: img.alt,
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
  new JSDOM(html).window.document.querySelectorAll('#article_contents li')
    .forEach(song => 
      songs.push({
        name: song.textContent,
        url: song.href
      })
    )
  return songs;
}

/**
 * 爬取-Top100 曲谱集合并存储至指定文件夹
 * @param {String} url 
 */
const crawlerTop100 = async url => {
  const html = await fetchDocument(url);
  const songs = filterSongsList(html);
  songs.forEach(song => {
    await crawlerSong(song.name, song.url)
  })
  debugger
}

/**
 * 爬取-指定曲谱所有图片并存储至指定文件夹
 * @param {String} name 
 * @param {String} url 
 */
const crawlerSong = async (name, url) => {
  const html = await fetchDocument(url);
  const imgs = filterImgUrl(html);
  const baseUrl = `./spectrum/${name}`;
  if(!fs.existsSync(baseUrl)) {
    fs.mkdirSync(baseUrl);
  }
  imgs.forEach((img, index) => {
    request.head(img.url, (error, res, body) => {
      if(error){
        console.log('失败了')
      }
    });
    request(img.url).pipe(fs.createWriteStream(`${baseUrl}/${img.name}_${index}.jpg`))
  })
}


module.exports = {
  crawlerSong,
  crawlerTop100
};

