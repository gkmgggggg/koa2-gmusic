import { Tag, Banner } from '../models/index'

export default class TagHelper {
  public static findTags = async (hot: number = 0) => {
    try {
      const data = hot === -1 ? await Tag.find({ hot: true }) : await Tag.find()
      return {
        success: true,
        data,
        msg: '成功调用接口!!!'
      }
    } catch (error) {
      return {
        success: false,
        data: {},
        msg: error.message || '数据交互时发生错误!!!'
      }
    }
  }

  public static findBanners = async () => {
    try {
      const data = await Banner.find()
      return {
        success: true,
        data,
        msg: '成功调用接口!!!'
      }
    } catch (error) {
      return {
        success: false,
        data: {},
        msg: error.message || '数据交互时发生错误!!!'
      }
    }
  }
}
