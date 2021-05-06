import { Song, PlayList, Singer } from '../models/index'
// const bluebird = require('bluebird')
// const jwt = require('jsonwebtoken')
// const verify = bluebird.promisify(jwt.verify)

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

  public static findRecommendSong = async () => {
    try {
      const data = await Song.find().limit(10)
      console.log(data)
      return {
        success: true,
        data,
        msg: '成功调用接口!!!'
      }
    } catch (error) {
      return {
        success: false,
        data: {},
        msg: error.message || '数据交互时发生错误!!!'
      }
    }
  }

  public static findSongDetail = async (ids:string) => {
    try {
      const songIds = ids.split(',')
      const data = []
      for (const id of songIds) {
        const song:any = await Song.findOne({ id: parseInt(id) })
        if (song && song.artistId) {
          const artist = await Singer.findOne({ id: parseInt(song.artistId) })
          data.push({ song, artist })

          // 判断歌曲是否被收藏
          // const token = ctx.request.headers.token
          // if (token !== null) {
          //   const secret = 'I_LOVE_NICEMUSIC'
          //   const payload = await verify(token, secret)
          //   const {
          //     phone,
          //     password
          //   } = payload
          //   let isCollected = false
          //   const user = await db.findOne('user', {
          //     account: phone.toString()
          //   })
          //   if (user !== null) {
          //     const result = await db.findOne('user_to_song', {
          //       artistId: ObjectId(user._id),
          //       songId: song.id.toString()
          //     })
          //     if (result !== null) isCollected = true
          //   }
          //   song.isCollected = isCollected
          // }
        }
      }
      return {
        success: true,
        data,
        msg: '成功调用接口!!!'
      }
    } catch (error) {
      return {
        success: false,
        data: {},
        msg: error.message || '数据交互时发生错误!!!'
      }
    }
  }
}
