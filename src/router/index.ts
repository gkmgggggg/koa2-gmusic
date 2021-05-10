import * as KoaRouter from 'koa-router'
import {
  UserController,
  SongController,
  CommomController,
  SingerController,
  playlistController
} from '../controller/index'
const router = new KoaRouter()

router.get('/api/findPlayList', SongController.getAllPlayList)
router.get('/api/getSong', SongController.getSongList)
router.get('/api/getRank', SongController.getRankList)
router.get('/api/banner', CommomController.getBanners)
router.get('/api/search', CommomController.getSearch)
router.get('/api/querySingerList', SingerController.getSingerList)

router.get('/api/song/recommend', SongController.getRecommendSong)
router.get('/api/song/detail', SongController.getSongDetail)

router.get('/api/playlist', playlistController.getPlaylist)
router.get('/api/playlist/rank', playlistController.getRank)
router.get('/api/playlist/recommend', playlistController.getRecommend)
router.get('/api/playlist/tag', CommomController.getTags)
router.get('/api/playlist/detail', playlistController.getDetail)
router.get('/api/playlist/comment', playlistController.getComment)

router.get('/api/singer/recommend', SingerController.getRecommendSinger)
router.get('/api/singer/list', SingerController.getSingerList)
router.get('/api/singer/song', SingerController.getSingerSong)
router.get('/api/singer/detail', SingerController.getSingerDetail)
router.get('/api/singer/album', SingerController.getSingerAlbum)

router.get('/api/user/login', UserController.Login)
router.get('/api/user/info', UserController.getUserInfo)
router.get('/api/user/collectSong', UserController.getCollectSong)
router.get('/api/user/collectPlaylist', UserController.getCollectPlaylist)
router.post('/api/user/collect/song', UserController.collectSong)
router.post('/api/user/collect/playlist', UserController.collectPlaylist)
router.post('/api/user/delete/song', UserController.deleteSong)
router.post('/api/user/delete/playlist', UserController.deletePlaylist)
router.post('/api/user/register', UserController.Register)
router.post('/api/user/postComment', UserController.postComment)

export default router
