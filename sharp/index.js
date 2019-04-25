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
 * 函数-合成图片
 */ 
const transformImage = async () => {
  const BLANL_LEFT = await generateBlank(600, 200);
  const BLANL_RIGHT = await generateBlank(400, 240);
  const BLANL_BOTTOM = await generateBlank(1860, 140);
  sharp('sharp.jpg')
    .threshold(210)
    .composite([{
      input: BLANL_LEFT,
      top: 0,
      left: 0,
    }, {
      input: BLANL_RIGHT,
      top: 0,
      left: 1460 
    }, {
      input: BLANL_BOTTOM,
      top: 2500,
      left: 0 
    }])
    .toFile('sharp_m.png', (err, info) => {
      console.log(err, info);
    });
}

transformImage();