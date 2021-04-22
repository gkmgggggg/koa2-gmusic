import { Context } from 'koa'
import DBHelper from '../DBHelper'
const { SongHelper } = DBHelper

export default class SongController {
  /**
   * @method 获取歌单
   */
  public static getAllPlayList = async (ctx: Context) => {
    const res: any = await SongHelper.findAll({
      offset: 0,
      limit: 20,
      tag: '民谣'
    })
    ctx.body = { res }
  }

  /**
   * @method 获取榜单
   */
  public static getRankList = async (ctx: Context) => {
    const res: any = await SongHelper.findRank()

    ctx.body = { res }
  }

  /**
   * @method 获取歌曲详情
   */
  public static getSongList = async (ctx: Context) => {
    const { ids } = ctx.query

    const data = await SongHelper.findSongList(ids)
    ctx.body = {
      status: 10001,
      msg: '请求成功',
      data
    }
  }
}
