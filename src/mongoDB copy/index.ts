import * as Mongoose from 'mongoose'
const MongoClient = require('mongodb').MongoClient
const Config = require('../config/index')

class Db {
  static dbClient: any = null
  constructor() {
    Db.dbClient = this.connect()
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (Db.dbClient) resolve(Db.dbClient)
      MongoClient.connect(Config.DBpath, {
        useUnifiedTopology: true
      }, (err: any, client: any) => {
        if (err) reject(err)
        const db = client.db(Config.dbName)
        resolve(db)
        console.log(`连接数据库成功`);
      })
    })
  }
}

// export const db = new Db()
export const mongoose = Mongoose
export const { Schema } = Mongoose