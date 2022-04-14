const http = require('http')
const server = http.createServer()

server.on('request', (req, res) => {
  const str = `您请求的 URL 地址是${req.url},请求的 method 类型是${req.method}`
  res.setHeader('Content-Type', 'text/html;charset=utf-8')
  res.end(str)
})

server.listen(80, () => {
  console.log('server running at http://127.0.0.1')
})
