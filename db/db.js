const MongoClient = require("mongodb").MongoClient;
const Config = require("./config");

class Db {
  static dbClient = null;
  constructor() {
    this.dbClient = this.connect();
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (this.dbClient) {
        // 解决数据库每次都要连接的问题（现在只需连接一次即可）
        resolve(this.dbClient);
      }
      MongoClient.connect(
        Config.url, {
          useUnifiedTopology: true
        },
        (err, client) => {
          if (err) {
            reject(err);
          }
          const db = client.db(Config.dbName);
          resolve(db);
        }
      );
    });
  }
  async insert(collectionName, data) {
    data.create_time = Date.now();
    data.update_time = Date.now();
    data.status = 1;
    return new Promise(async (resolve, reject) => {
      const db = await this.connect();
      await db.collection(collectionName).insertOne(data, (err, res) => {
        if (err) reject(err);
        else resolve(res.ops[0]);
      });
    });
  }
  async remove(collectionName, json) {
    return new Promise(async (resolve, reject) => {
      const db = await this.connect();
      const res = await db.collection(collectionName).removeOne(json, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }
  async find(collectionName, query) {
    return new Promise(async (resolve, reject) => {
      const db = await this.connect();
      const res = await db.collection(collectionName).find(query);
      res.toArray((err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }
  async findOne(collectionName, query) {
    return new Promise(async (resolve, reject) => {
      const db = await this.connect();
      const res = await db.collection(collectionName).findOne(query, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }
  async update(collectionName, json1, json2) {
    json2.update_time = Date.now();
    return new Promise(async (resolve, reject) => {
      const db = await this.connect();
      await db.collection(collectionName).updateOne(
        json1, {
          $set: json2
        },
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }
  async updateAll(collectionName, json1, json2) {
    json2.update_time = Date.now();
    return new Promise(async (resolve, reject) => {
      const db = await this.connect();
      await db.collection(collectionName).updateMany(
        json1, {
          $set: json2
        },
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }
  async removeOne(collectionName, params) {
    return new Promise(async (resolve, reject) => {
      const db = await this.connect();
      await db.collection(collectionName).removeOne(
        params,
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }
  async pagination(collectionName, query, page, limit) {
    return new Promise(async (resolve, reject) => {
      const db = await this.connect();
      console.log(page, limit, page * limit, limit * 1);
      const res = await db
        .collection(collectionName)
        .find(query)
        .skip(page * limit)
        .limit(limit * 1);
      res.toArray((err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }
  async pagination2(collectionName, query, offset, limit) {
    return new Promise(async (resolve, reject) => {
      const db = await this.connect();
      // console.log(page, limit, page * limit, limit * 1);
      const res = await db
        .collection(collectionName)
        .find(query)
        .skip(parseInt(offset))
        .limit(parseInt(limit));
      res.toArray((err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }
  async getCount(collectionName, query) {
    return new Promise(async (resolve, reject) => {
      const db = await this.connect();
      const res = await db
        .collection(collectionName)
        .find(query).count();
      resolve(res);
    });
  }
  async songSheetFilter(collectionName, cat, offset, limit) {
    return new Promise(async (resolve, reject) => {
      const db = await this.connect();
      const res = await db.collection(collectionName).find();
      // if (result.length > offset) {
      // result = result.skip(offset).limit(limit)
      res.toArray((err, data) => {
        if (err) reject(err);
        let result = data.filter(item => {
          if (item.tags.indexOf(cat) == -1) return false
          return true
        })
        if (result.length > offset) {
          result = result.slice(offset, offset + limit)
          resolve(result)
          // result.skip(offset).limit(limit)
        }
        reject("数据不存在!!!")
      })
    })
  }
  async getSongSheetCount(collectionName, cat) {
    if (cat == "全部") return this.getCount(collectionName, {})
    else {
      const db = await this.connect();
      const res = await db.collection(collectionName).find();
      res.toArray((err, data) => {
        let result = data.filter(item => {
          if (item.tags.indexOf(cat) == -1) return false
          return true
        })
        return result.length
      })
    }
  }
  //查询搜索结果
  async getSearchList(collectionName, offset, limit, keywords) {
    return new Promise(async (resolve, reject) => {
      const db = await this.connect()
      var reg = new RegExp(keywords);
      let all = await db.collection(collectionName).find({
        'name': reg
      })
      let count = 0;
      all.toArray((err, data) => {
        if (err) reject(err)
        count = data.length
        let res = data.slice(offset, limit)
        let result = {
          count,
          res
        }
        resolve(result)
      })
    })
  }
}


DB = new Db();

module.exports = DB;