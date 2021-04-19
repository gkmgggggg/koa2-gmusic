import { Context } from 'koa'
import DBHelper from '../DBHelper'
const { SingerHelper } = DBHelper

export default class SingerController {
  public static getSingerList = async (ctx: Context) => {
    const {
      offset = 0,
      limit = 40,
      type = 0, //0全部 1男歌手，2女歌手，3乐队
      area = -1 //-1全部 7华语，96欧美，8日本，16韩国，0其他
    } = ctx.query

    let params = {
      offset: Number(offset),
      limit: Number(limit),
      type: Number(type),
      area: Number(area)
    }

    let res: any = await SingerHelper.findSingerList(params)

    ctx.body = {
      res
    }
  }

  public static getSingerDetail = async (ctx: Context) => {
    const {
      id = "f"
    } = ctx.query

    let res: any = await SingerHelper.findSinger(id)

    ctx.body = {
      res
    }
  }
}
