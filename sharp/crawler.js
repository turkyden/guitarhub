const http = require('http');
const request = require('request');
const fs = require('fs');
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
      res.setEncoding('GB2312');
      let html = '';
      res.on('data', chunk => { html += chunk; });
      res.on('end', () => {
        try {
          debugger
          resolve(html);
        } catch (e) {
          reject(e.message);
        }
      });
    }).on('error', e => {
      reject(`Got error: ${e.message}`);
    });
  })

/**
 * 函数-获取
 * @param {*} html 
 */
const getImgUrlFromHTML = html => {
  const IMG = new JSDOM(html).window.document.querySelector('#article_contents img');
  return {
    name: IMG.alt,
    url: IMG.src,
    modify: new Date().toISOString()
  };
}

const saveFiles = () => {

}

const URL = 'http://www.17jita.com/tab/img/3991.html'

fetchDocument(URL)
  .then(html => {
    console.log('图片爬取成功：', getImgUrlFromHTML(html));
  })
  .catch(error => {
    console.log(error)
  })
