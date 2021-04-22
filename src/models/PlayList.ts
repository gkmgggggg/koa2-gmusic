import { DB, Schema } from '../mongoDB/index'

const playlistSchema = new Schema({
  id: String,
  name: String, // 账号 --- 手机号
  description: String,
  tags: Array,
  songList: Array,
  coverImgUrl: String,
  playCount: Number,
  creatorId: String,
  createTime: Number,
  updateTime: Number
})
const PlayList = DB.model('playlist', playlistSchema, 'playlist')

export default PlayList
