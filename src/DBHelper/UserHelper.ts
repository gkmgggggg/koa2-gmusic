import { User, UserToSong, UserToPlaylist, Song, PlayList } from '../models/index'
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const ObjectId = require('mongodb').ObjectId
export default class UserHelper {
  public static findUser = async (params:any) => {
    try {
      const md5 = crypto.createHash('md5')
      const newPas = md5.update(params.password).digest('hex')
      const data = await User.findOne({ account: params.account, password: newPas })
      if (!data) {
        return {
          success: false,
          data: null,
          msg: '登陆失败'
        }
      }
      const secret = 'I_LOVE_NICEMUSIC'
      const Authorization = jwt.sign({
        phone: params.account,
        password: newPas
      }, secret, {
        expiresIn: 3600 * 24
      })
      return {
        success: true,
        data,
        msg: '成功调用接口!!!',
        Authorization
      }
    } catch (error) {
      return {
        success: false,
        data: {},
        msg: error.message || '数据交互时发生错误!!!'
      }
    }
  }

  public static createUser = async (params:any) => {
    const md5 = crypto.createHash('md5')
    const newPas = md5.update(params.password).digest('hex')
    const data = {
      account: params.account,
      password: newPas,
      avatarUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1603815950990&di=f7c8c044e096a01612fb362b88de8e32&imgtype=0&src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202005%2F21%2F20200521203428_wmequ.thumb.400_0.jpeg',
      level: 0,
      nickname: '用户' + Date.now().toString()
    }
    const user = await User.findOne({ account: params.account })
    if (user) {
      return {
        success: false,
        data: user,
        msg: '账号已存在!!!'
      }
    }
    await User.create(data)
    return {
      success: true,
      data: {},
      msg: '注册成功!!!'
    }
  }

  public static findUserInfo = async (params: any) => {
    try {
      const data = await User.findOne({ _id: ObjectId(params.id) })
      if (!data) {
        return {
          success: false,
          data: null,
          msg: '失败'
        }
      }
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

  public static findUserSong = async (params: any) => {
    try {
      const songIds = await UserToSong.find({ artistId: ObjectId(params.id) })
      const data:any = []
      songIds.forEach(async (item:any) => {
        const song = await Song.findOne({ id: Number(item.songId) })
        if (song) data.push(song)
      })
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

  public static findUserPlaylist = async (params: any) => {
    try {
      const playlistIds = await UserToPlaylist.find({ artistId: ObjectId(params.id) })
      const data: any = []
      playlistIds.forEach(async (item: any) => {
        const playlist = await PlayList.findOne({ id: Number(item.songId) })
        if (playlist) data.push(playlist)
      })
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
