const express = require('express')

const router = express.Router()

const artcate_handler = require('../router_handler/artcate')

const { add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema } = require('../schema/artcate')
const expressJoi = require('@escook/express-joi')

// 获取文章分类列表
router.get('/cates', artcate_handler.getArticleCates)

// 新增文章
router.post('/addcates', expressJoi(add_cate_schema), artcate_handler.addArticleCates)

// 删除文章
router.post('/deletecate/:id', expressJoi(delete_cate_schema), artcate_handler.deleteCateById)

// 获取文章分类数据
router.get('/cates/:id', expressJoi(get_cate_schema), artcate_handler.getArticleById)

// 更新文章
router.post('/updatecate', expressJoi(update_cate_schema), artcate_handler.updateCateById)

module.exports = router
