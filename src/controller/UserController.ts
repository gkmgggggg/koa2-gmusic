import { Context } from 'koa'
import DBHelper from '../DBHelper'
const { UserHelper } = DBHelper

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
    const res = await UserHelper.findUserSong({ id })
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
    const res = await UserHelper.findUserPlaylist({ id })
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
