import { Context } from 'koa'
import DBHelper from '../DBHelper'
const { PlaylistHelper, CommentHelper } = DBHelper

export default class CommomController {
  public static getRecommend = async (ctx:Context) => {
    const res = await PlaylistHelper.findRecommend()
    if (res.success) {
      ctx.body = {
        success: true,
        status: 200,
        msg: '成功获取数据',
        data: res.data
      }
      return
    }
    ctx.body = {
      success: false,
      status: 400,
      msg: '未成功获取数据',
      data: null
    }
  }

  public static getRank = async (ctx: Context) => {
    const res = await PlaylistHelper.findRank()
    if (res.success) {
      ctx.body = {
        success: true,
        status: 200,
        msg: '成功获取数据',
        data: res.data
      }
      return
    }
    ctx.body = {
      success: false,
      status: 400,
      msg: '未成功获取数据',
      data: null
    }
  }

  public static getPlaylist = async (ctx: Context) => {
    let {
      type = '全部',
      offset = 0,
      limit = 30
    } = ctx.query
    offset = Number(offset)
    limit = Number(limit)
    const res = await PlaylistHelper.findPlaylist({ type, offset, limit })
    if (res.success) {
      ctx.body = {
        success: true,
        status: 200,
        msg: '成功获取数据',
        data: res.data
      }
      return
    }
    ctx.body = {
      success: false,
      status: 400,
      msg: '未成功获取数据',
      data: null
    }
  }

  public static getDetail = async (ctx:Context) => {
    const query = ctx.query
    const id:number = Number(query.id)
    const res = await PlaylistHelper.findPlaylistDetail(id)
    if (res.success) {
      ctx.body = {
        success: true,
        status: 200,
        msg: '成功获取数据',
        data: res.data
      }
      return
    }
    ctx.body = {
      success: false,
      status: 400,
      msg: '未成功获取数据',
      data: null
    }
  }

  public static getComment = async (ctx: Context) => {
    const { id } = ctx.query
    const res = await CommentHelper.findComment(id)
    if (res.success) {
      ctx.body = {
        success: true,
        status: 200,
        msg: '成功获取数据',
        data: res.data
      }
      return
    }
    ctx.body = {
      success: false,
      status: 400,
      msg: '未成功获取数据',
      data: null
    }
  }
}
