import { DB, Schema } from '../mongoDB/index'

const userToPlaylistSchema = new Schema({
  artistId: String,
  playlistId: String
})
const UserToPlaylist = DB.model('user_to_playlist', userToPlaylistSchema, 'user_to_playlist')

export default UserToPlaylist
