import * as KoaRouter from 'koa-router'
import {
  UserController,
  SongController,
  CommomController,
  SingerController
} from '../controller/index'
const router = new KoaRouter()

router.get('/api/findUser', UserController.queryUser)
router.get('/api/findPlayList', SongController.getAllPlayList)
router.get('/api/getSong', SongController.getSongList)
router.get('/api/getRank', SongController.getRankList)
router.get('/api/getTags', CommomController.getTags)
router.get('/api/banner', CommomController.getBanners)
router.get('/api/querySingerList', SingerController.getSingerList)
router.get('/api/querySinger', SingerController.getSingerDetail)

export default router
