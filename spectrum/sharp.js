const fs = require('fs');
const sharp = require('sharp');

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
    .toBuffer()

/**
 * 函数-合成指定图片
 * @param {*} index 
 * @param {*} base 
 * @param {*} target 
 */
const sharpImage = async (index, base, target) => 
  sharp(base)
    .threshold(210)
    .composite([{
      input: index != 0 ? await generateBlank(600, 130) : await generateBlank(600, 200),
      top: 0,
      left: 0,
    }, {
      input: await generateBlank(400, 240),
      top: 0,
      left: 1460
    }, {
      input: await generateBlank(1860, 140),
      top: 2500,
      left: 0 
    }])
    .toFile(target);

/**
 * 函数-处理整首歌曲
 */ 
const sharpSongs = async () => {
  const baseUrl = `./spectrum/classic132`;
  const targetUrl = `./spectrum/classic132_sharp`;
  fs.existsSync(targetUrl) || fs.mkdirSync(targetUrl);
  const songs = fs.readdirSync(baseUrl);
  for (let index = 0; index < songs.length; index++) {
    const song = songs[index];
    const baseSongUrl = `${baseUrl}/${song}`;
    const targetSongUrl = `${targetUrl}/${song}`;
    fs.existsSync(targetSongUrl) || fs.mkdirSync(targetSongUrl);
    const images = fs.readdirSync(baseSongUrl);
    const info = await Promise.all(images.map((img, index)=> 
      sharpImage(index, `${baseSongUrl}/${img}`, `${targetSongUrl}/${img}`)
    ))
    console.log('☑️: ' + song + '【' + info.length + '】')
  }
}




module.exports = sharpSongs;