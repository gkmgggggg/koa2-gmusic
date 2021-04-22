import { DB, Schema } from '../mongoDB/index'

const singerSchema = new Schema({
  id: Number,
  name: String, // 账号 --- 手机号
  type: Number,
  area: Number,
  mvSize: Number,
  musicSize: Number,
  albumSize: Number,
  img1v1Url: String,
  picUrl: String,
  briefDesc: String,
  introduction: Array
})
const Singer = DB.model('singer', singerSchema, 'singers')

export default Singer
