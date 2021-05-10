import { Context } from 'koa'
import DBHelper from '../DBHelper'
const { TagHelper, CommentHelper } = DBHelper

export default class CommomController {
  public static getTags = async (ctx: Context) => {
    const { hot = 0 } = ctx.query
    const res = Number(hot) === -1 ? await TagHelper.findTags(-1) : await TagHelper.findTags()
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
      success: true,
      status: 400,
      msg: '未成功获取数据',
      data: {}
    }
  }

  public static getBanners = async (ctx: Context) => {
    const data = await TagHelper.findBanners()
    if (data.success) {
      ctx.body = {
        success: true,
        status: 200,
        msg: '成功获取数据',
        data: data.data
      }
      return
    }
    ctx.body = {
      success: true,
      status: 400,
      msg: '未成功获取数据',
      data: {}
    }
  }

  public static getSearch = async (ctx: Context) => {
    const { keyword, limit, offset, type } = ctx.query
    const res = await CommentHelper.findSearch({ keyword, limit, offset, type })
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
      success: true,
      status: 400,
      msg: '未成功获取数据',
      data: {}
    }
  }
}
