const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require("koa2-cors");

const index = require('./routes/index')
const singer = require('./routes/singer')
const users = require('./routes/users')
const songsheet = require('./routes/songsheet')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// 跨域
app.use(cors());

// logger
app.use(async (ctx, next) => {
  // ctx.set("Access-Control-Allow-Origin", "*");
  // ctx.set(
  //   "Access-Control-Allow-Headers",
  //   "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
  // );
  // ctx.set("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(singer.routes(), singer.allowedMethods())
app.use(songsheet.routes(), songsheet.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app