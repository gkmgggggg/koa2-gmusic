import { Singer } from '../models/index'

interface IUser {
  account: String,
  password: String
}

interface pageParams {
  offset: number,
  limit: number,
  type: number, //0全部 1男歌手，2女歌手，3乐队
  area: number //-1全部 7华语，96欧美，8日本，16韩国，0其他
}

interface singerParams {
  type?: number,
  area?: number
}

export default class SingerHelper {
  public static findSingerList = async (params: pageParams) => {
    let dbParams: singerParams = {}
    if (params.type !== 0) dbParams.type = params.type
    if (params.area !== -1) dbParams.area = params.area

    const total = await Singer.count(dbParams)
    const data = await Singer.find(dbParams).skip(params.limit * params.offset).limit(params.limit)
    const hasMore = Number(total) > params.limit * params.offset + data.length
    return {
      status: 10001,
      data,
      total,
      hasMore
    }
  }

  public static findSinger = async (id: number) => {
    const data = await Singer.findOne({ id: Number(id) })
    return {
      status: 10001,
      data
    }
  }
}