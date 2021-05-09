import { DB, Schema } from '../mongoDB/index'

const userToSongSchema = new Schema({
  artistId: Object,
  songId: String
})
const UserToSong = DB.model('user_to_song', userToSongSchema, 'user_to_song')

export default UserToSong
