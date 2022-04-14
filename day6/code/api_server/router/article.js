const express = require('express')
const router = express.Router()
const article_handle = require('../router_handler/article')

const multer = require('multer')
const path = require('path')
const upload = multer({ dest: path.join(__dirname, '../uploads') })

const { add_article_schema } = require('../schema/article')
const expressJoi = require('@escook/express-joi')

// 发布文章
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), article_handle.addArticle)

module.exports = router
