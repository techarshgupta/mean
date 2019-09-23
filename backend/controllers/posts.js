const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    imagePath: url + '/images/' + req.file.filename,
    content: req.body.content,
    creator: req.userData.userId,
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'post added successfully',
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  }).catch((error) => {
    res.status(500).json({
      message: 'Post creation failed! Please Try Again',
    })
  });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });
  console.log(post);
  Post.updateOne(
    {
      _id: req.params.id,
      creator: req.userData.userId
    },
    post
  ).then(result => {
    if (result.n > 0) {
      res.status(200).json({
        message: 'updated successfully',
        result
      });
    } else {
      res.status(401).json({
        message: 'Not Authorised',
        result
      });
    }
  }).catch((error) => {
    res.status(500).json({
      message: 'Could not find the post',
    });
  });
};

exports.getAllPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'posts fetched successfully',
        posts: fetchedPosts,
        maxPosts: count
      });
    }).catch((error) => {
      res.status(500).json({
        message: 'Fetching Post failed! Please Try Again',
      });
    });
};

exports.getPostById = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found !'
      });
    }
  }).catch((error) => {
    res.status(500).json({
      message: 'Fetching Post failed! Please Try Again',
    });
  });
};

exports.deleteById = (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId
  }).then(result => {
    if (result.n > 0) {
      res.status(200).json({
        message: 'deleted  successfully',
        result
      });
    } else {
      res.status(401).json({
        message: 'Not Authorised',
        result
      });
    }
  }).catch((error) => {
    res.status(500).json({
      message: 'Deleting the Post failed! Please Try Again',
    });
  });
};