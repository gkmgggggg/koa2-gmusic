import { DB, Schema } from '../mongoDB/index'

const mvSchema = new Schema({
  id: Number,
  name: String, //账号 --- 手机号
  artistId: Number,
  imgurl: String,
  imgurl16v9: Number,
  duration: Number,
  playCount: Number,
  publishTime: String,
})
const Mv = DB.model('mv', mvSchema, 'mv')

export default Mv