import { DB, Schema } from '../mongoDB/index'

const albumSchema = new Schema({
  id: Number,
  name: String, //账号 --- 手机号
  artistId: Number,
  blurPicUrl: String,
  picUrl: String,
  publishTime: Number,
  company: String,
})
const Album = DB.model('album', albumSchema, 'album')

export default Album