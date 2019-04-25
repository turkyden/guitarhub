const http = require('http');
const request = require('request');
const fs = require('fs');
const iconv = require('iconv-lite');
const jsdom = require("jsdom");

const { JSDOM } = jsdom;

/**
 * 发起请求加载页面
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
 * 函数-从网页中清洗出曲谱
 * @param {String} html 网页字符串
 */
const getImgUrlFromHTML = html => {
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


const URL = 'http://www.17jita.com/tab/whole_3991.html'

fetchDocument(URL)
  .then(html => {
    const imgs = getImgUrlFromHTML(html);
    console.log('图片爬取成功：', imgs);
    debugger
  })
  .catch(error => {
    console.log(error)
  })
