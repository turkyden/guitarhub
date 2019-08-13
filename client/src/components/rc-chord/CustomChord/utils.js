export default {
  /**
   * 函数-获取和弦点位坐标值
   * @param {Object} point 和弦点位
   * @param {Object} config 和弦配置项
   */
  getPointCoordinates(point, config) {
    return {
      x: config.origin.x + config.axisOffset.x * point.x,
      y: config.origin.y + config.axisOffset.y * point.y
    }
  },
  /**
   * 函数-获取和弦标注坐标值
   * @param {Object} point 和弦点位
   * @param {Object} config 和弦配置项
   */
  getTextCoordinates(point, config) {
    return {
      x: config.origin.x + config.axisOffset.x * point.x,
      y: config.origin.y + config.axisOffset.y * point.y + config.textYAxisOffset
    }
  },
  /**
   * 函数-获取和弦横按坐标值
   * @param {Object} point 和弦点位
   * @param {Object} config 和弦配置项
   */
  getCrossCoordinates(point, config) {
    return {
      leftLine: {
        x1: config.origin.x + config.axisOffset.x * point.x - config.crossOffset,
        y1: config.origin.y + config.axisOffset.y * point.y - config.crossOffset,
        x2: config.origin.x + config.axisOffset.x * point.x + config.crossOffset,
        y2: config.origin.y + config.axisOffset.y * point.y + config.crossOffset,
      },
      rightLine: {
        x1: config.origin.x + config.axisOffset.x * point.x + config.crossOffset,
        y1: config.origin.y + config.axisOffset.y * point.y - config.crossOffset,
        x2: config.origin.x + config.axisOffset.x * point.x - config.crossOffset,
        y2: config.origin.y + config.axisOffset.y * point.y + config.crossOffset,
      }
    }
  },
  getMiddleCoordinates(pointA, pointB) {
    return {
      x: (pointA.x + pointB.x) / 2,
      y: (pointA.y + pointB.y) / 2
    }
  },
}