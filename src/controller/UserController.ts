import { Context } from 'koa'
import DBHelper from '../DBHelper'
const { UserHelper } = DBHelper

export default class UserController {
  public static queryUser = async (ctx: Context) => {
    // const res = await UserHelper.findUser()
    // console.log(res);
    // ctx.body = {res}
    ctx.body = {
      status: 10001,
      msg: "请求成功!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
      data: [1, 2, 3, 4]
    }
  }
}
