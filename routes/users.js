const router = require('koa-router')()
const crypto = require('crypto')
const db = require('../db/db')
const jwt = require('jsonwebtoken')
const ObjectId = require('mongodb').ObjectId;

router.prefix('/user')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

//获取用户详细信息detail
router.get('/detail', async function (ctx, next) {
  const {
    id
  } = await ctx.query
  let res = await db.findOne('user', {
    _id: ObjectId(id)
  });
  if (res !== null) {
    ctx.body = {
      code: 200,
      res,
      msg: "用户详细信息"
    }
  } else {
    ctx.body = {
      code: 406,
      msg: "出现了不可预知的情况。。。"
    }
  }
})

//用户注册
router.post('/register', async function (ctx, next) {
  const {
    phone,
    password
  } = await ctx.request.body;
  let msg = '账号存在!!!'
  let code = 406
  let res = await db.findOne('user', {
    account: phone
  })
  let md5 = crypto.createHash("md5");
  let newPas = md5.update(password).digest("hex");
  if (res === null) {
    msg = '注册成功!!!'
    code = 200
    const data = {
      account: phone,
      password: newPas,
      avatarUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1603815950990&di=f7c8c044e096a01612fb362b88de8e32&imgtype=0&src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202005%2F21%2F20200521203428_wmequ.thumb.400_0.jpeg',
      level: 0,
      nickname: '用户' + Date.now().toString(),
    }
    await db.insert('user', data)
  }
  ctx.body = {
    code,
    msg,
    res
  }
})

//用户登录
router.post('/login', async function (ctx, next) {
  const {
    phone,
    password
  } = await ctx.request.body;
  let res = await db.findOne('user', {
    account: phone
  })
  if (res === null) {
    ctx.body = {
      code: 406,
      msg: "账号不存在"
    }
  } else {
    let md5 = crypto.createHash("md5");
    let newPas = md5.update(password).digest("hex");
    if (newPas !== res.password) {
      ctx.body = {
        code: 406,
        msg: "密码错误！！！"
      }
    } else {
      let secret = 'I_LOVE_NICEMUSIC';
      let Authorization = jwt.sign({
        phone,
        password
      }, secret, {
        expiresIn: 3600 * 24
      });
      ctx.body = {
        code: 200,
        msg: "登录成功！！！",
        res,
        Authorization
      }
    }
  }
})

//用户收藏歌单
router.post('/collectplaylist', async function (ctx, next) {
  const {
    uid,
    pid
  } = ctx.request.body;
  let playList = await db.findOne('playlist', {
    id: parseInt(pid)
  })
  if (playList !== null) {
    let data = {
      artistId: ObjectId(uid),
      playlistId: pid
    }
    db.insert('user_to_playlist', data)
    ctx.body = {
      code: 200,
      msg: "收藏歌单成功"
    }
  } else {
    ctx.body = {
      code: 406,
      msg: "收藏歌单失败"
    }
  }

})

//用户取消收藏歌单 /user/deleteplayList
router.post('/deleteplaylist', async function (ctx, next) {
  const {
    uid,
    pid
  } = ctx.request.body;
  let data = await db.findOne('user_to_playlist', {
    artistId: ObjectId(uid),
    playlistId: pid
  })
  if (data !== null) {
    db.removeOne('user_to_playlist', data)
    ctx.body = {
      code: 200,
      msg: "成功取消收藏"
    }
  } else {
    ctx.body = {
      code: 406,
      msg: "出现不可预知的错误！！！"
    }
  }
})

//判断某歌单是否被用户收藏 iscollected
router.get('/iscollected', async function (ctx, next) {
  const {
    uid,
    pid
  } = ctx.query;
  let data = await db.findOne('user_to_playlist', {
    artistId: ObjectId(uid),
    playlistId: pid
  })
  if (data !== null) {
    ctx.body = {
      code: 200,
      msg: "该歌单已被用户受收藏",
      flag: true
    }
  } else {
    ctx.body = {
      code: 406,
      msg: "该歌单未被用户收藏",
      flag: false
    }
  }
})

//收藏歌曲 /collectsong
router.post('/collectsong', async function (ctx, next) {
  const {
    uid,
    pid
  } = ctx.request.body;
  let song = await db.findOne('songs', {
    id: parseInt(pid)
  })
  if (song !== null) {
    let data = {
      artistId: ObjectId(uid),
      songId: pid
    }
    db.insert('user_to_song', data)
    ctx.body = {
      code: 200,
      msg: "收藏歌单成功"
    }
  } else {
    ctx.body = {
      code: 406,
      msg: "收藏歌单失败"
    }
  }
})

//用户取消收藏歌曲deletetsong
router.post('/deletetsong', async function (ctx, next) {
  const {
    uid,
    pid
  } = ctx.request.body;
  let data = await db.findOne('user_to_song', {
    artistId: ObjectId(uid),
    songId: pid
  })
  if (data !== null) {
    db.removeOne('user_to_song', data)
    ctx.body = {
      code: 200,
      msg: "成功取消收藏"
    }
  } else {
    ctx.body = {
      code: 406,
      msg: "出现不可预知的错误！！！"
    }
  }
})

//判断歌曲是否被用户所收藏 /issongcollected
router.get('/issongcollected', async function (ctx, next) {
  const {
    uid,
    pid
  } = ctx.query;
  let data = await db.findOne('user_to_song', {
    artistId: ObjectId(uid),
    songId: pid
  })
  if (data !== null) {
    ctx.body = {
      code: 200,
      msg: "该歌曲已被用户受收藏",
      flag: true
    }
  } else {
    ctx.body = {
      code: 406,
      msg: "该歌曲未被用户收藏",
      flag: false
    }
  }
})

// collectlist 获取用户收藏的歌单
router.get('/collectlist', async function (ctx, next) {
  const {
    id
  } = ctx.query;
  let data = await db.find('user_to_playlist', {
    artistId: ObjectId(id),
  })
  let res = []
  for (let item of data) {
    let playlist = await db.findOne('playlist', {
      id: parseInt(item.playlistId)
    })
    res.push(playlist)
  }
  ctx.body = {
    code: 200,
    msg: "用户收藏歌单",
    res
  }
})

// getcollectssongs 获取用户收藏的歌曲
router.get('/getcollectssongs', async function (ctx, next) {
  const {
    id
  } = ctx.query;
  let data = await db.find('user_to_song', {
    artistId: ObjectId(id),
  })
  let res = []
  for (let item of data) {
    let song = await db.findOne('songs', {
      id: parseInt(item.songId)
    })
    let artist = await db.findOne('singers', {
      "id": parseInt(song.artistId)
    })
    song['artist'] = artist
    res.push(song)
  }
  ctx.body = {
    code: 200,
    msg: "用户收藏歌曲",
    res
  }
})

// submitComment添加评论
router.post('/submitComment', async (ctx, next) => {
  const {
    uid,
    pid,
    comment
  } = ctx.request.body;
  const playlist = await db.find('playlist', {
    id: pid
  })
  const user = await db.find('user', {
    id: ObjectId(id),
  })
  if (!playlist || !user) {
    ctx.body = {
      code: 500,
      msg: '为找到用户或歌单！！！',
      res: null
    }
  }
  const data = {
    userId: uid,
    playlistId: pid,
    comment: comment
  }
  await db.insert('comments', data)
  ctx.body = {
    code: 500,
    msg: '为找到用户或歌单！！！',
    res: null
  }
})
module.exports = router