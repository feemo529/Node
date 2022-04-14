// 导入 express
const express = require('express')
// 创建服务器的实例对象
const app = express()

// 配置 cors 中间件
const cors = require('cors')
app.use(cors())

// 配置解析表单数据的中间件 注意：这个中间件 只能解析 application/x-www-form-urlencoded 格式的表单
app.use(express.urlencoded({ extended: false }))

// 响应数据的中间件 一定要在路由之前，封装 res.cc 函数
app.use((req, res, next) => {
  // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
  res.cc = function (err, status = 1) {
    res.send({
      status,
      // 状态描述，判断 err 是 错误对象 还是 字符串
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 一定要在路由之前配置解析 Token 的中间件
const config = require('./config')
const expressJWT = require('express-jwt')

app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }))

// 导入配置路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
const userinfoRouter = require('./router/userinfo')
// 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my', userinfoRouter)
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)

app.use('/uploads', express.static('./uploads'))

// 导入 joi 模块，记得 npm i joi
const joi = require('joi')
// 错误中间件
app.use((err, req, res, next) => {
  // 参数校验失败
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 捕获token失败
  if (err.name === 'UnauthorizedError') {
    return res.cc('无效的token', 401)
  }
  // 未知错误
  res.cc(err, 500)
})

app.listen(3007, () => {
  console.log('api server running at http://127.0.0.1:3007')
})
