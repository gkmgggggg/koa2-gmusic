import * as koa from 'koa'
import * as koaBodyparser from 'koa-bodyparser'
// import * as jwt from 'koa-jwt'
import * as cors from 'koa2-cors'
import errorHandle from './middleware/errorHandle'
import router from './router'
const app = new koa()
app
  .use(
    cors({
      allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
      allowMethods: ['GET', 'POST', 'DELETE'],
      credentials: true,
      exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
      maxAge: 5,
      origin: () => '*',
    })
  )
  .use(errorHandle)
  // .use(
  //   jwt({ secret: admin }).unless({
  //     path: [/\/get/, '/api/login', '/api/update-user', '/api/reptile'],
  //   })
  // )
  .use(koaBodyparser())
  .use(router.routes())
  .use(router.allowedMethods())
app.listen(2500)
