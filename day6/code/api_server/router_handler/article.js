const path = require('path')
const db = require('../db/index')

// 发布新文章
exports.addArticle = (req, res) => {
  // 手动判断是否上传了文章封面
  if (!req.file || req.file.filename !== 'cover_ig=mg') return res.cc('文章封面是必选参数！')

  const articleInfo = {
    ...req.body,
    cover_img: path.join('/uploads', req.file.filename),
    pub_state: new Date(),
    author_id: req.user.id
  }
  const sql = 'insert into ev_articles set ?'
  db.query(sql, articleInfo, (err, result) => {
    if (err) return res.cc(err)
    if (result.affectedRows !== 1) return res.cc('发布文章失败！')

    res.cc('发布文章成功', 0)
  })
}
