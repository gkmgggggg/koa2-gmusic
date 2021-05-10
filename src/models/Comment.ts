import { DB, Schema } from '../mongoDB/index'

const commentSchema = new Schema({
  artistId: Object,
  playlistId: String,
  content: String,
  imageUrl: String,
  create_time: Number,
  updata_time: Number,
  user: Object
})
const Comment = DB.model('comment', commentSchema, 'comment')

export default Comment
