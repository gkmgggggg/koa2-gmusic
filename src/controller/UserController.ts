import { Context } from 'koa'
import DBHelper from '../DBHelper'
import PlayListHelper from '../DBHelper/PlaylistHelper'
const { UserHelper, SongHelper } = DBHelper

export default class UserController {
  public static Login = async (ctx:Context) => {
    const { account, password } = ctx.query
    const res = await UserHelper.findUser({ account, password })
    if (res.success) {
      ctx.body = {
        success: true,
        status: 200,
        msg: '登陆成功',
        data: res.data,
        Authorization: res.Authorization
      }
      return
    }
    ctx.body = {
      success: false,
      status: 400,
      msg: '登陆失败',
      data: null
    }
  }

  public static Register = async (ctx:Context) => {
    const { account, password } = await ctx.request.body
    const res = await UserHelper.createUser({ account, password })
    if (res.success) {
      ctx.body = {
        success: true,
        status: 200,
        msg: '注册成功',
        data: res.data
      }
      return
    }
    ctx.body = {
      success: false,
      status: 400,
      msg: '注册失败',
      data: null
    }
  }

  public static getUserInfo = async (ctx: Context) => {
    const { id } = ctx.query
    const res = await UserHelper.findUserInfo({ id })
    if (res.success) {
      ctx.body = {
        success: true,
        status: 200,
        msg: '成功',
        data: res.data
      }
      return
    }
    ctx.body = {
      success: false,
      status: 400,
      msg: '失败',
      data: null
    }
  }

  public static getCollectSong = async (ctx: Context) => {
    const { id } = ctx.query
    const { songIds } = await UserHelper.findUserSongIds({ id })
    const ids = songIds.map((item:any) => item.songId).join(',')
    const res = await SongHelper.findSongDetail(ids)
    if (res.success) {
      ctx.body = {
        success: true,
        status: 200,
        msg: '成功',
        data: res.data
      }
      return
    }
    ctx.body = {
      success: false,
      status: 400,
      msg: '失败',
      data: null
    }
  }

  public static getCollectPlaylist = async (ctx: Context) => {
    const { id } = ctx.query
    const { playlistIds } = await UserHelper.findUserPlaylist({ id })
    const res = await PlayListHelper.findPlaylistsDetail(playlistIds)
    if (res.success) {
      ctx.body = {
        success: true,
        status: 200,
        msg: '成功',
        data: res.data
      }
      return
    }
    ctx.body = {
      success: false,
      status: 400,
      msg: '失败',
      data: null
    }
  }

  public static collectSong = async (ctx: Context) => {
    const { uid, sid } = await ctx.request.body // 获取用户id和歌曲id
    const res = await UserHelper.createUserSong({ uid, sid })
    if (res.success) {
      ctx.body = {
        success: true,
        status: 200,
        msg: '成功',
        data: res.data
      }
      return
    }
    ctx.body = {
      success: false,
      status: 400,
      msg: '失败',
      data: null
    }
  }

  public static collectPlaylist = async (ctx: Context) => {
    const { uid, pid } = await ctx.request.body // 获取用户id和歌单id
    const res = await UserHelper.createUserPlaylist({ uid, pid })
    if (res.success) {
      ctx.body = {
        success: true,
        status: 200,
        msg: '成功',
        data: res.data
      }
      return
    }
    ctx.body = {
      success: false,
      status: 400,
      msg: '失败',
      data: null
    }
  }

  public static deleteSong = async (ctx: Context) => {
    const { uid, sid } = await ctx.request.body // 获取用户id和歌单id
    const res = await UserHelper.deleteUserSong({ uid, sid })
    if (res.success) {
      ctx.body = {
        success: true,
        status: 200,
        msg: '成功',
        data: res.data
      }
      return
    }
    ctx.body = {
      success: false,
      status: 400,
      msg: '失败',
      data: null
    }
  }

  public static deletePlaylist = async (ctx: Context) => {
    const { uid, pid } = await ctx.request.body // 获取用户id和歌单id
    const res = await UserHelper.deleteUserPlaylist({ uid, pid })
    if (res.success) {
      ctx.body = {
        success: true,
        status: 200,
        msg: '成功',
        data: res.data
      }
      return
    }
    ctx.body = {
      success: false,
      status: 400,
      msg: '失败',
      data: null
    }
  }
}
