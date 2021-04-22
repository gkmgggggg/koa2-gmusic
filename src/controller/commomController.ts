import { Context } from 'koa'
import DBHelper from '../DBHelper'
const { TagHelper } = DBHelper

export default class CommomController {
  public static getTags = async (ctx: Context) => {
    const { hot = 0 } = ctx.query
    const res = Number(hot) === -1 ? await TagHelper.findTags(-1) : await TagHelper.findTags()
    ctx.body = {
      res
    }
  }

  public static getBanners = async (ctx: Context) => {
    const res = await TagHelper.findBanners()
    ctx.body = {
      res
    }
  }
}
