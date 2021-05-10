import { Comment, PlayList, User, Song, Singer } from '../models/index'
const ObjectId = require('mongodb').ObjectId

export default class CommentHelper {
  public static createComment = async (params:any) => {
    try {
      const userFind:any = await User.findOne({ _id: ObjectId(params.uid) })
      const playlist = await PlayList.findOne({ id: Number(params.pid) })
      const user = {
        nickname: userFind.nickname,
        avatarUrl: userFind.avatarUrl,
        _id: userFind._id
      }
      const data = {
        artistId: userFind._id,
        playlistId: playlist.id,
        content: params.content,
        create_time: Date.now(),
        updata_time: Date.now(),
        user
      }
      if (!userFind || !playlist) {
        // 没找到用户或歌曲
        return {
          success: false,
          data: {},
          msg: '参数错误!!!'
        }
      }
      await Comment.create(data)
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

  public static findComment = async (id: string) => {
    try {
      const data = await Comment.find({ playlistId: id })
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

  public static findSearch = async (params: any) => {
    try {
      let Tool = null
      switch (Number(params.type)) {
        case 1: Tool = Song; break
        case 2: Tool = Singer; break
        case 3: Tool = PlayList; break
        default:break
      }
      const reg = new RegExp(params.keyword, 'i')
      const searchData = await Tool.find({ name: { $regex: reg } }).skip(Number(params.offset)).limit(Number(params.limit))
      return {
        success: true,
        data: searchData,
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
