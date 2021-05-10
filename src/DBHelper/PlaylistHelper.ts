import { PlayList } from '../models/index'
interface pageParams {
  offset: number,
  limit: number,
  type: string, // 类型
}

// interface singerParams {
//   type?: number,
//   area?: number
// }

export default class PlayListHelper {
  public static findRecommend = async () => {
    const data = await PlayList.find().limit(16)
    return {
      success: true,
      data: data
    }
  }

  public static findRank = async () => {
    try {
      const data = await PlayList.find({ creatorId: null })
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

  public static findPlaylist = async (params: pageParams) => {
    try {
      const dbParams = params.type === '全部' ? {} : { tags: { $elemMatch: { $eq: params.type } } }
      const total = await PlayList.count(dbParams)
      const playlistData = await PlayList.find(dbParams).skip(params.offset).limit(params.limit)
      return {
        success: true,
        status: 200,
        data: {
          data: playlistData,
          total
        },
        msg: '成功调用接口!!!'
      }
    } catch (error) {
      return {
        success: false,
        status: 400,
        data: {},
        msg: error.message || '数据交互时发生错误!!!'
      }
    }
  }

  public static findPlaylistDetail = async (id:number) => {
    try {
      const data = await PlayList.findOne({ id })
      return {
        success: true,
        status: 200,
        data,
        msg: '成功调用接口!!!'
      }
    } catch (error) {
      return {
        success: false,
        status: 400,
        data: {},
        msg: error.message || '数据交互时发生错误!!!'
      }
    }
  }

  public static findPlaylistsDetail = async (ids: number[]) => {
    try {
      const data = []
      for (const id of ids) {
        const playlist = await PlayList.findOne({ id })
        if (playlist) data.push(playlist)
      }
      return {
        success: true,
        status: 200,
        data,
        msg: '成功调用接口!!!'
      }
    } catch (error) {
      return {
        success: false,
        status: 400,
        data: {},
        msg: error.message || '数据交互时发生错误!!!'
      }
    }
  }
}
