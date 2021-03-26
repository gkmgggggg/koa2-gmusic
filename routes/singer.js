const router = require('koa-router')()
const db = require('../db/db')

//获取歌手数据
router.get('/singer', async (ctx, next) => {
  const {
    offset = 0,
      limit = 40,
      type = 0, //0全部 1男歌手，2女歌手，3乐队
      area = -1, //-1全部 7华语，96欧美，8日本，16韩国，0其他
      // intiial = 0 //首字母
  } = ctx.query
  let params = {}
  if (type != -1) params.type = parseInt(type)
  if (area != -1) params.area = parseInt(area)
  // console.log(params);
  let res = await db.pagination2('singers', params, parseInt(offset), parseInt(limit))
  let count = await db.getCount('singers', params)
  let more = true;
  if (count > parseInt(offset) + parseInt(limit))
    more = true;
  else more = false
  console.log(count);
  ctx.body = {
    code: 200,
    title: '歌手数据',
    res,
    count,
    more
  }
})

//获取歌手详情
router.get('/singerdetail', async (ctx, next) => {
  const {
    id
  } = ctx.query
  console.log(id);
  let params = {
    id: parseInt(id)
  }
  if (id) {
    let res = await db.findOne('singers', params)
    console.log(res);
    ctx.body = {
      code: 200,
      title: '歌手数据',
      res,
    }
  }
})

//获取歌手歌曲
router.get('/singer/songs', async (ctx, next) => {
  const {
    id
  } = ctx.query
  if (id) {
    let res = await db.find('songs', {
      "artistId": parseInt(id)
    })
    let artist = await db.findOne('singers', {
      "id": parseInt(id)
    })
    for (item of res) {
      item['artist'] = artist
    }
    ctx.body = {
      code: 200,
      title: '歌手歌曲',
      res,
    }
  }
})

//获取歌手专辑
router.get('/singer/album', async (ctx, next) => {
  const {
    id
  } = ctx.query
  if (id) {
    let res = await db.find('album', {
      "artistId": parseInt(id)
    })
    let artist = await db.findOne('singers', {
      "id": parseInt(id)
    })
    for (item of res) {
      item['artist'] = artist
    }
    ctx.body = {
      code: 200,
      title: '歌手专辑',
      res,
    }
  }
})

//获取歌手MV
router.get('/singer/mv', async (ctx, next) => {
  const {
    id
  } = ctx.query
  if (id) {
    let res = await db.find('mv', {
      "artistId": parseInt(id)
    })
    let artist = await db.findOne('singers', {
      "id": parseInt(id)
    })
    for (item of res) {
      item['artist'] = artist
    }
    ctx.body = {
      code: 200,
      title: '歌手数据',
      res,
    }
  }
})

// 获取全部MV /mv/all
router.get('/mv/all', async (ctx, next) => {
  const {
    limit,
    offset,
  } = ctx.query
  let res = await db.pagination2('mv', {}, offset, limit)
  let count = await db.getCount('mv')
  let more = true;

  for (item of res) {
    let artist = await db.findOne('singers', {
      "id": parseInt(item['artistId'])
    })
    item['artist'] = artist
  }
  if (count > parseInt(offset) + parseInt(limit))
    more = true;
  else more = false
  ctx.body = {
    code: 200,
    title: 'MV数据',
    res,
    more
  }
})

//获得MV详情  /mv/detail
router.get('/mv/detail', async (ctx, next) => {
  const {
    id
  } = ctx.query
  if (id) {
    let res = await db.findOne('mv', {
      "id": parseInt(id)
    })
    ctx.body = {
      code: 200,
      title: 'MV数据',
      res,
    }
  } else {
    ctx.body = {
      code: 200,
      status: '参数错误',
    }
  }
})

module.exports = router