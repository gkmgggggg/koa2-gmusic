const router = require('koa-router')()
const db = require('../db/db')

router.prefix('/home')

//获取轮播图
router.get('/banner', async (ctx, next) => {
  let res = await db.find('banner')
  ctx.body = {
    code: 200,
    title: '轮播图数据',
    res
  }
})
//获取推荐歌曲
router.get('/newsong', async (ctx, next) => {
  let res = await db.find('newsongs')
  ctx.body = {
    code: 200,
    title: '推荐新歌',
    res
  }
})

//获取首页热门歌手
router.get('/hotsinger', async (ctx, next) => {
  let res = await db.find('topsingers')
  ctx.body = {
    code: 200,
    title: '热门歌手',
    res
  }
})

//获取歌曲详情
router.get('/songdetail', async (ctx, next) => {
  let {
    id
  } = ctx.query;
  let res = await db.findOne('songs', {
    id: parseInt(id)
  })
  let artist = await db.findOne('singers', {
    "id": parseInt(res['artistId'])
  })
  res['artist'] = artist
  ctx.body = {
    code: 200,
    title: '歌曲详情',
    res
  }
})

//获取首页歌单
router.get('/playlist', async (ctx, next) => {
  const {
    limit = 24,
    offset = 0
  } = ctx.query
  let res = await db.pagination2('playlist', {}, offset, limit)
  ctx.body = {
    code: 200,
    title: '歌曲详情',
    res
  }
})

//获取搜索内容
router.get('/search', async (ctx, next) => {
  const {
    keywords,
    type = 1,
    limit = 24,
    offset = 0
  } = ctx.query
  if (keywords === null) {
    ctx.body = {
      code: 406,
      msg: "似乎出现了什么问题"
    }
    return;
  }
  switch (parseInt(type)) {
    //查询歌曲
    case 1: {
      let res = await db.getSearchList('songs', offset, limit, keywords)
      for (i of res.res) {
        let artist = await db.findOne('singers', {
          "id": parseInt(i.artistId)
        })
        i['artist'] = artist
      }
      ctx.body = {
        code: 200,
        msg: "查询数据",
        res
      }
      break;
    }
    case 2: {
      let res = await db.getSearchList('singers', offset, limit, keywords)
      ctx.body = {
        code: 200,
        msg: "查询数据",
        res
      }
      break;
    }
    case 3: {
      let res = await db.getSearchList('album', offset, limit, keywords)
      for (i of res.res) {
        let artist = await db.findOne('singers', {
          "id": parseInt(i.artistId)
        })
        i['artist'] = artist
      }
      ctx.body = {
        code: 200,
        msg: "查询数据",
        res
      }
      break;
    }
    case 4: {
      let res = await db.getSearchList('mv', offset, limit, keywords)
      for (i of res.res) {
        let artist = await db.findOne('singers', {
          "id": parseInt(i.artistId)
        })
        i['artist'] = artist
      }
      ctx.body = {
        code: 200,
        msg: "查询数据",
        res
      }
      break;
    }
    case 5: {
      let res = await db.getSearchList('playlist', offset, limit, keywords)
      ctx.body = {
        code: 200,
        msg: "查询数据",
        res
      }
      break;
    }
    default: {
      let res = await db.getSearchList('songs', offset, limit, keywords)
      for (i of res.res) {
        let artist = await db.findOne('singers', {
          "id": parseInt(i.artistId)
        })
        i['artist'] = artist
      }
      ctx.body = {
        code: 200,
        msg: "查询数据",
        res
      }
      break;
    }
  }
})
module.exports = router