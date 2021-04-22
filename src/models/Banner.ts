import { DB, Schema } from '../mongoDB/index'

const bannerSchema = new Schema({
  typeTitle: String,
  imageUrl: String,
  id: Number,
  hot: Boolean,
  url: Number
})
const Banner = DB.model('banner', bannerSchema, 'banner')

export default Banner
