const express = require('express');
const router = express.Router();
const NewsController = require('../../controllers/newscontroller');

// Tạo mới bài viết
router.post('/', NewsController.createNews);

// Lấy bài viết theo ID
router.get('/:id', NewsController.getNewsById);

// Lấy tất cả bài viết
router.get('/', NewsController.getAllNews);

// Cập nhật bài viết
router.put('/:id', NewsController.updateNews);

// Xóa bài viết
router.delete('/:id', NewsController.deleteNews);

module.exports = router;
