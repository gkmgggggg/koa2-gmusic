import { PlayList, User } from '../models/index'
const ObjectId = require('mongodb').ObjectId
interface pageParams {
  offset: number,
  limit: number,
  type: string, // 类型
}

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

  public static createPlaylist = async (params: any) => {
    try {
      const user = await User.findOne({ _id: ObjectId(params.createId) })
      if (!user) {
        return {
          success: false,
          status: 400,
          data: {},
          msg: '没有该用户!!!'
        }
      }
      const data:any = {
        id: Date.now(),
        name: params.name, // 账号 --- 手机号
        description: params.desc,
        tags: params.tagList,
        songList: [],
        coverImgUrl: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=710895375,1979842946&fm=26&gp=0.jpg',
        playCount: 0,
        creatorId: user._id,
        createTime: Date.now(),
        updateTime: Date.now()
      }
      await PlayList.create(data)
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

  public static findCreatePlaylist = async (uid:string) => {
    try {
      const data = await PlayList.find({ creatorId: uid })
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

  public static findPlaylistById = async (pid:string) => {
    try {
      const data = await PlayList.findOne({ _id: ObjectId(pid) })
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

  public static updataPlaylist = async (params: any) => {
    try {
      const songList = params.songList
      if (songList.indexOf(params.sid) !== -1) {
        return {
          success: false,
          status: 400,
          data: null,
          msg: '失败调用接口!!!'
        }
      }
      songList.push(params.sid)
      await PlayList.update({ _id: ObjectId(params.pid) }, { songList })
      return {
        success: true,
        status: 200,
        data: {},
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
