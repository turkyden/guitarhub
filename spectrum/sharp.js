const fs = require('fs');
const sharp = require('sharp');
const PDFDocument = require('pdfkit');
const log4js = require('log4js');
const _ = require('lodash');

// 日志管理
log4js.configure({
  appenders: { 
    cheese: { type: 'file', filename: './spectrum/cheese.log' },
  },
  categories: { 
    default: { appenders: ['cheese'], level: 'trace' } 
  }
})

const logger = log4js.getLogger('cheese');

logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Comté.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');


const SHARP_1 = {
  width: 1860,
  height: 2631
}

const SHARP_2 = {
  width: 1785,
  height: 2525
}

/**
 * 函数-生成指定尺寸空白图层
 * @param {Number} width 图层卷度
 * @param {Number} height 图层高度
 */
const generateBlank = (width, height) =>
  sharp({
    create: {
      width: width,
      height: height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .png()
    .toBuffer();

/**
 * 函数-图片处理
 * @param {String} pageIndex 当前页码
 * @param {String} base 原始路径
 * @param {String} target 目标输出路径
 */
const sharpImage = async (pageIndex, base, target) => {
  const { width, height } = await sharp(base).metadata();
  const size = { width, height };
  if (_.isEqual(size, SHARP_1)) {
    return sharp(base)
      .threshold(210)
      .composite([
        {
          input: pageIndex != 0 ? await generateBlank(600, 130) : await generateBlank(600, 200),
          top: 0,
          left: 0,
        }, {
          input: pageIndex != 0 ? await generateBlank(400, 100) : await generateBlank(420, 240),
          top: 0,
          left: 1460
        }, {
          input: await generateBlank(1860, 150),
          top: 2481,
          left: 0 
        }
      ])
      .toFile(target);
  } else if (_.isEqual(size, SHARP_2)) {
    return sharp(base)
      .threshold(210)
      .composite([
        {
          input: pageIndex != 0 ? await generateBlank(170, 170) : await generateBlank(340, 170),
          top: 0,
          left: 0,
        }, {
          input: pageIndex != 0 ? await generateBlank(620, 120) : await generateBlank(620, 170),
          top: 0,
          left: 1164
        }, {
          input: await generateBlank(1785, 130),
          top: 2395,
          left: 0 
        }
      ])
      .toFile(target);
  } else {
    return sharp(base)
      .threshold(210)
      .toFile(target);
  }
}

/**
 * 函数-保存成 PDF 文件
 * @param {String} targetSongUrl 
 */
const savePDF = async (targetSongUrl) => {
  const images = fs.readdirSync(targetSongUrl);
  const fileName = images[0].split('.')[0];
  const doc = new PDFDocument({ autoFirstPage: false });
  doc.pipe(fs.createWriteStream(`${targetSongUrl}/${fileName}.pdf`));
  images.forEach(img => {
    doc.addPage()
    .image(`${targetSongUrl}/${img}`, 0, 0, { fit: [612.00, 792.00], align: 'center', valign: 'center' })
  })
  doc.end();
}

/**
 * 函数-图像处理歌曲队列
 */ 
const sharpSongs = async () => {
  const baseUrl = `./spectrum/classic132`;
  const targetUrl = `./spectrum/classic132_sharp`;
  fs.existsSync(targetUrl) || fs.mkdirSync(targetUrl);
  const songs = fs.readdirSync(baseUrl);
  for (let index = 0; index < 5; index++) {
    const song = songs[index];
    const baseSongUrl = `${baseUrl}/${song}`;
    const targetSongUrl = `${targetUrl}/${song}`;
    fs.existsSync(targetSongUrl) || fs.mkdirSync(targetSongUrl);
    const images = fs.readdirSync(baseSongUrl);
    const info = await Promise.all(images.map((img, index) => 
      sharpImage(index, `${baseSongUrl}/${img}`, `${targetSongUrl}/${img}`)
    ))
    info.length > 0 ? savePDF(targetSongUrl) : console.log('🚑', info);
  }
}

sharpSongs();