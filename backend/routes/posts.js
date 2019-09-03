const express = require('express');

const router = express.Router();

const Post = require('../models/post');

// saving the post to DB
router.post('', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message: 'post added successfully',
      postId: createdPost._id
    });
  });
});

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({
    _id: req.params.id
  }, post).then(result => {
    console.log(result);
    res.status(201).json({
      message: "updated successfully"
    });
  });
});

// fetching the posts from DB
router.get('', (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'posts fetched successfully',
      posts: documents,
    });
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found !'
      });
    }
  });
});

// deleting the post 
router.delete('/:id', (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then(result => {
    console.log("TCL: result", result);
  });
  res.status(200).json({
    message: 'post deleted successfully',
  });
});

module.exports = router;