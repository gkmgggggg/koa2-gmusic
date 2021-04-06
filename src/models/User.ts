import { mongoose, Schema } from '../mongoDB/index'

const userSchema = new Schema({
  id: String,
  account: String, //账号 --- 手机号
  password: String,
  avatarUrl: String,
  level: Number,
  nickname: String,
  create_time: String,
  status: Number,
  address: String,
  email: String
})
const User = mongoose.model('user', userSchema)

export default User