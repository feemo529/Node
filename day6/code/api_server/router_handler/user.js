// 导入数据库操作模块
const db = require('../db/index.js')
// 导入加密模块
const bcrypt = require('bcryptjs')
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config')

// 注册新用户的处理函数
exports.regUser = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.body
  // if (!userinfo.username || !userinfo.password) {
  //   return res.send({ status: 1, message: '用户名或密码不合法！' })
  // }
  // 定义 SQL 语句，查询用户名是否被占用
  const sqlStr = 'select * from ev_users where username=?'
  db.query(sqlStr, userinfo.username, (err, result) => {
    // 执行失败返回
    if (err) {
      // return res.send({ status: 1, message: err.message })
      return res.cc(err)
    }
    // 判断是否被占用
    if (result.length > 0) {
      // return res.send({ status: 1, message: '用户名被占用，请更换用户名！' })
      return res.cc('用户名被占用，请更换用户名')
    }
    // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    //
    const sql = 'insert into ev_users set ?'
    db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, result) => {
      if (err) {
        // return res.send({ status: 1, message: err.message })
        return res.cc(err)
      }
      // SQL 语句执行成功，但影响行数不为 1
      if (result.affectedRows !== 1) {
        // return res.send({ status: 1, message: '注册用户失败，请稍后再试！' })
        return res.cc('注册用户失败，请稍后再试！')
      }
      res.send({
        status: 0,
        message: '注册成功'
      })
    })
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  // 接收表单数据
  const userinfo = req.body
  const sql = 'select * from ev_users where username=?'
  db.query(sql, userinfo.username, (err, result) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但是查询到数据条数不等于 1
    if (result.length !== 1) return res.cc('登录失败！')

    // 判断用户输入的登录密码是否和数据库中的密码一致
    // 拿着用户输入的密码,和数据库中存储的密码进行对比
    // 如果对比的结果等于false,则证明用户输入的密码错误
    const compareResult = bcrypt.compareSync(userinfo.password, result[0].password)
    if (!compareResult) return res.cc('密码错误！')

    // 登录成功，生成 Token 字符串
    const user = { ...result[0], password: '', user_pic: '' }
    // 生成 Token 字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn // token 有效期为 10 个小时
    })
    res.send({
      status: 0,
      message: '登录成功',
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      token: 'Bearer ' + tokenStr
    })
  })
}
