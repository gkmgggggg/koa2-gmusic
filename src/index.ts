import * as koa from 'koa'
import * as koaBodyparser from 'koa-bodyparser'
// import * as jwt from 'koa-jwt'
import * as cors from 'koa2-cors'
import errorHandle from './middleware/errorHandle'
import router from './router'
import * as mongoDB from './mongoDB'

mongoDB.connect()
const app = new koa()

// app.use(cors({
//   allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
//   allowMethods: ['GET', 'POST', 'DELETE'],
//   credentials: true,
//   exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
//   maxAge: 5,
//   origin: () => '*',
// }))

app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = Number(new Date()) - Number(start)
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(
  cors({
    origin: function (ctx: koa.Context) { //设置允许来自指定域名请求
      if (ctx.url === '/test') {
        return '*'; // 允许来自所有域名请求
      }
      return '*'//http://localhost:8080'; //只允许http://localhost:8080这个域名的请求
    },
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法'
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
  })
);

// app.use(errorHandle)
// .use(
//   jwt({ secret: admin }).unless({
//     path: [/\/get/, '/api/login', '/api/update-user', '/api/reptile'],
//   })
// )
app.use(koaBodyparser())
  .use(router.routes())
  .use(router.allowedMethods())
app.listen(2500)