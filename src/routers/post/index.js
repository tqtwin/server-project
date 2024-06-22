const express = require('express');
const router = express.Router();
const postController = require('../../controllers/postcontroller');

router.post('/create-post', postController.createPost);
router.get('/get-post-by-id/:id', postController.getPostById);
router.put('/update-post/:id', postController.updatePost);
router.delete('/delete-post/:id', postController.deletePost);

module.exports = router;
