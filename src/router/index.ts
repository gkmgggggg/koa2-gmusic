import * as KoaRouter from 'koa-router'
import {
  UserController,
} from '../controller/index'
const router = new KoaRouter()
router
  .get('/api/reptile', UserController.queryUser)
export default router
