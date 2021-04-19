import { Context } from 'koa'
import DBHelper from '../DBHelper'
const { TagHelper } = DBHelper

export default class commomController {
  public static getTags = async (ctx: Context) => {
    const { hot } = ctx.query
    let res = null
    if (hot && Number(hot) === -1) {
      res = await TagHelper.findTags(-1)
    } else {
      res = await TagHelper.findTags()
    }
    ctx.body = {
      res
    }
  }

  public static getBanners = async (ctx: Context) => {
    let res = await TagHelper.findBanners()
    ctx.body = {
      res
    }
  }
}
