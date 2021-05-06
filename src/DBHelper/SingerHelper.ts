import { Album, Singer, Song } from '../models/index'
interface pageParams {
  offset: number,
  limit: number,
  type: number, // 0全部 1男歌手，2女歌手，3乐队
  area: number // -1全部 7华语，96欧美，8日本，16韩国，0其他
}

interface singerParams {
  type?: number,
  area?: number
}

export default class SingerHelper {
  public static findSingerList = async (params: pageParams) => {
    const dbParams: singerParams = {}
    if (params.type !== -1) dbParams.type = params.type
    if (params.area !== -1) dbParams.area = params.area

    const total = await Singer.count(dbParams)
    const singerData = await Singer.find(dbParams).skip(params.offset).limit(params.limit)
    const hasMore = Number(total) > params.offset + singerData.length
    return {
      success: true,
      data: {
        total,
        hasMore,
        data: singerData
      }
    }
  }

  public static findSinger = async (id: number) => {
    try {
      const data = await Singer.findOne({ id: Number(id) })
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

  public static findRecommendSinger = async () => {
    try {
      const data = await Singer.find().limit(20)
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

  public static findSingerSong = async (id: number) => {
    try {
      const data = await Song.find({ artistId: Number(id) }).limit(50)
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

  public static findSingerAlbum = async (id: number) => {
    try {
      const data = await Album.find({ artistId: Number(id) }).limit(50)
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
