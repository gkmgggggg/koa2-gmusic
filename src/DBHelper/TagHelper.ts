import { Tag, Banner } from '../models/index'

export default class TagHelper {
  public static findTags = async (hot: number = 0) => {
    let data: any
    if (hot === -1) {
      data = await Tag.find({ hot: true })
    } else {
      data = await Tag.find()
    }
    return {
      status: 10001,
      data
    }
  }

  public static findBanners = async () => {
    const data = await Banner.find()
    return {
      status: 10001,
      data
    }
  }
}
