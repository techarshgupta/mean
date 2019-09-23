const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file-mime');

const PostsController = require('../controllers/posts');

// saving the post to DB
router.post(
  '',
  checkAuth,
  extractFile,
  PostsController.createPost
);

// Updating the post by id
router.put(
  '/:id',
  checkAuth,
  extractFile,
  PostsController.updatePost
);

// fetching the posts from DB
router.get('', PostsController.getAllPosts);

// fetching the posts By ID
router.get('/:id', PostsController.getPostById);

// deleting the post
router.delete('/:id', checkAuth, PostsController.deleteById);

module.exports = router;
