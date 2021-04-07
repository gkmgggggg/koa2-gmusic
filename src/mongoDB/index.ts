import * as mongoose from 'mongoose'
const Config = require('../config/index');
(mongoose as any).Promise = global.Promise
export const DB = mongoose
export const { Schema } = DB
// 数据库
export const connect = () => {
  // 连接数据库
  // const DBpath = 'mongodb://127.0.0.1:27017/nmusic'
  DB.connect(Config.DBpath)
  // 连接错误
  DB.connection.on('error', error => {
    // tslint:disable-next-line
    console.error('数据库连接失败!', error)
  })

  // 连接成功
  DB.connection.once('open', () => {
    // tslint:disable-next-line
    console.log('数据库连接成功!')
  })

  return DB
}
