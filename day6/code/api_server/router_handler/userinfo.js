const db = require('../db/index')
const bcrypt = require('bcryptjs')

// 获取用户信息
exports.getUserInfo = (req, res) => {
  const sql = 'select id,username,nicknamd,email,user_pic from ev_users where id=?'
  // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
  db.query(sql, req.user.id, (err, result) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但是查询到的数据条数不等于 1
    if (result.length !== 1) return res.cc('获取用户信息失败')
    res.send({
      status: 0,
      meassage: '获取用户基本信息成功!',
      data: result[0]
    })
  })
}

// 更新用户信息
exports.updateUserInfo = (req, res) => {
  const sql = 'update ev_users set ? where id=?'
  db.query(sql, [req.body, req.body.id], (err, result) => {
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但影响行数不为 1
    if (result.affectedRows !== 1) return res.cc('修改用户基本信息失败！')

    res.cc('修改用户基本信息成功! ', 0)
  })
}

// 重置密码
exports.updatePassword = (req, res) => {
  // 定义根据 id 查询用户数据的 SQL 语句
  const sql = 'select * from ev_users where id=?'
  db.query(sql, req.user.id, (err, result) => {
    if (err) return res.cc(err)
    if (result.length !== 1) return res.cc('用户不存在!')
    // 判断提交的密码是否正确
    const compareResult = bcrypt.compareSync(req.body.oldPwd, result[0].password)
    if (!compareResult) return res.cc('原密码错误！')
    // 更新密码
    const sqlStr = 'update ev_users set password=? where id=?'
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
    db.query(sqlStr, [newPwd, req.user.id], (err, result) => {
      if (err) return res.cc(err)
      if (result.affectedRows !== 1) return res.cc('修改密码失败！')

      res.cc('修改密码成功！', 0)
    })
  })
}

// 更新头像
exports.updateAvatar = (req, res) => {
  const sql = 'update ev_users set user_pic=? where id=?'
  db.query(sql, [req.body.avatar, req.user.id], (err, result) => {
    if (err) return res.cc(err)
    if (result.affectedRows !== 1) return res.cc('更新头像失败!')

    res.cc('更新头像成功!', 0)
  })
}
