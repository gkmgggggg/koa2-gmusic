import { Song, PlayList } from '../models/index'

interface PlayListParams {
  offset: number,
  limit: number,
  tag: string
}

export default class SongHelper {
  /**
   * @method 数据库获取指定分类的歌单（分页）
   */
  public static findAll = async (params: PlayListParams) => {
    return new Promise((resolve, reject) => {
      PlayList.find({}, async (err, doc) => {
        if (err) {
          reject(err)
        }
        const total = doc.length
        const data: any = await PlayList.find({ tags: { $elemMatch: { $eq: params.tag } } }).skip(params.offset * params.limit).limit(params.limit)

        resolve({
          status: 10001,
          msg: '请求成功!',
          data,
          total,
          hasMore: '是否有更多数据'
        })
      })
    })
  }

  /**
   * @method 数据库获取歌曲数据
   */
  public static findSong = async (id: string) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const song = await Song.findOne({ id: Number(id) })
      resolve(song)
      Song.findOne({ id: Number(id) }, (err, doc) => {
        if (err) {
          reject(err)
        }
        resolve(doc)
      })
    })
  }

  /**
 * @method 数据库获取歌曲列表数据
 */
  public static findSongList = async (ids: string) => {
    const idList: string[] = ids.split(',')
    idList.map(item => Number(item))
    const data = await Song.find({ id: { $in: idList } })
    return data
  }

  /**
   * @method 数据库获取榜单类型的歌单
   */
  public static findRank = async () => {
    const data = PlayList.find({
      creatorId: null
    })
    console.log(data)
    return data
  }
}
