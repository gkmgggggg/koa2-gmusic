import { DB, Schema } from '../mongoDB/index'

const songSchema = new Schema({
  id: Number,
  name: String,
  publishTime: Number,
  duration: Number,
  coverImgUrl: String,
  artistId: Number,
  url: String
})
const Song = DB.model('song', songSchema, 'song')

export default Song
