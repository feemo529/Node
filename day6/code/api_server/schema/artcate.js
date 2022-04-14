const joi = require('joi')

// 校验规则对象 - 添加分类
const name = joi.string().required()
const alias = joi.string().alphanum().required()
exports.add_cate_schema = {
  body: {
    name,
    alias
  }
}

// 删除分类
const id = joi.number().integer().min(1).required()
exports.delete_cate_schema = {
  params: {
    id
  }
}

// 获取文章分类列表
exports.get_cate_schema = {
  params: {
    id
  }
}

// 更新文章
exports.update_cate_schema = {
  body: {
    id,
    name,
    alias
  }
}
