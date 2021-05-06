import { Context } from 'koa'
import DBHelper from '../DBHelper'
const { SingerHelper } = DBHelper

export default class SingerController {
  public static getSingerList = async (ctx: Context) => {
    const {
      offset = 0,
      limit = 40,
      type = 0, // 0全部 1男歌手，2女歌手，3乐队
      area = -1 // -1全部 7华语，96欧美，8日本，16韩国，0其他
    } = ctx.query

    const params = {
      offset: Number(offset),
      limit: Number(limit),
      type: Number(type),
      area: Number(area)
    }

    const res = await SingerHelper.findSingerList(params)

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
      msg: '成功获取数据',
      data: null
    }
  }

  public static getSingerDetail = async (ctx: Context) => {
    const { id } = ctx.query
    const res = await SingerHelper.findSinger(id)
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
      msg: '获取数据失败',
      data: null
    }
  }

  public static getRecommendSinger = async (ctx:Context) => {
    const res = await SingerHelper.findRecommendSinger()
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
      msg: '成功获取数据',
      data: null
    }
  }

  public static getSingerSong = async (ctx: Context) => {
    const { id } = ctx.query
    const res = await SingerHelper.findSingerSong(id)
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
      msg: '成功获取数据',
      data: null
    }
  }

  public static getSingerAlbum = async (ctx:Context) => {
    const { id } = ctx.query
    const res = await SingerHelper.findSingerAlbum(id)
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
      msg: '成功获取数据',
      data: null
    }
  }
}
