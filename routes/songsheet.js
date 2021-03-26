const router = require('koa-router')()
const db = require('../db/db')
const Promise = require("bluebird");
const jwt = require('jsonwebtoken');
const {
  ObjectId
} = require('mongodb');
const verify = Promise.promisify(jwt.verify);

//获得歌单
router.get('/playlist', async (ctx, next) => {
  const {
    offset = 0,
      limit = 40,
      cat = '全部',
  } = ctx.query
  let res = ''
  if (cat != '全部') res = await db.songSheetFilter('playlist', cat, offset, limit);
  else res = await db.pagination2('playlist', {}, offset, limit);
  let count = await db.getSongSheetCount('playlist', cat)
  ctx.body = {
    code: 200,
    title: '歌单数据',
    res,
    count
  }
})

//获得热门歌单分类
router.get('/playlist/hot', async (ctx, next) => {
  let res = await db.find('tag', {
    hot: true
  })
  ctx.body = {
    code: 200,
    title: '热门歌单类别',
    res,
  }
})

//获得歌单分类
router.get('/playlist/catlist', async (ctx, next) => {
  let res = await db.find('tag')
  ctx.body = {
    code: 200,
    title: '歌单分类数据',
    res,
  }
})

//获得歌单详情
router.get('/playlist/detail', async (ctx, next) => {
  const {
    id
  } = ctx.query;
  let params = {
    id: parseInt(id)
  }
  let res = await db.findOne('playlist', params)
  ctx.body = {
    code: 200,
    title: '歌单详细数据',
    res,
  }
})

//获得歌单歌曲/playlist/songdetail
router.get('/playlist/songdetail', async (ctx, next) => {
  const {
    ids
  } = ctx.query;
  let songIds = ids.split(',')
  let res = []
  for (let id of songIds) {
    let song = await db.findOne('songs', {
      id: parseInt(id)
    })
    if (song !== null) {
      let artist = await db.findOne('singers', {
        "id": parseInt(song['artistId'])
      })
      song['artist'] = artist
      song.duration = parseFloat(song.duration / 1000)
      let token = ctx.request.headers['token'];
      if (token !== null) {
        let secret = 'I_LOVE_NICEMUSIC';
        let payload = await verify(token, secret);
        let {
          phone,
          password
        } = payload;
        let isCollected = false;
        let user = await db.findOne("user", {
          account: phone.toString()
        })
        if (user !== null) {
          let result = await db.findOne('user_to_song', {
            artistId: ObjectId(user._id),
            songId: song['id'].toString()
          })
          if (result !== null) isCollected = true
        }
        song['isCollected'] = isCollected
      }
      res.push(song)
    }
  }
  ctx.body = {
    code: 200,
    title: '歌单详细数据',
    res,
  }
})

//获得榜单
router.get('/rank', async (ctx, next) => {
  let res = await db.find('playlist', {
    creatorId: null
  })
  ctx.body = {
    code: 200,
    title: '榜单数据',
    res,
  }
})

module.exports = router