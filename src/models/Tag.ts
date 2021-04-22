import { DB, Schema } from '../mongoDB/'

const tagSchema = new Schema({
  name: String,
  type: Number,
  category: Number,
  hot: Boolean
})
const Tag = DB.model('tag', tagSchema, 'tag')

export default Tag
