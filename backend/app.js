const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose'); //4VDIVneHWDmjaPY0
const uri = 'mongodb+srv://meanHar:4VDIVneHWDmjaPY0@cluster0-bhe0s.mongodb.net/node-angular?retryWrites=true&w=majority';

// Object Schemas
const Post = require('./models/post');

// creating the app
const app = express();

// DB Connection
mongoose.connect(uri, {
  useNewUrlParser: true
}).then(() => {
  console.log("I am connected to DB !");
}).catch(() => {
  console.log("Error to connect to DB !");
});

// parse the body for whole app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// fixing the CORS policy
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-*, Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// saving the post to DB
app.post('/api/posts', (req, res, next) => {
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

// fetching the posts from DB
app.get('/api/posts', (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'posts fetched successfully',
      posts: documents,
    });
  });
});

// deleting the post 
app.delete('/api/posts:id', (req, res, next) => {
  console.log("TCL: id", req.params.id);
  // Post.deleteOne({
  //   _id: req.params.id
  // }).then(result => {
  //   console.log("TCL: result", result);
  // });
  res.status(200).json({
    message: 'post deleted successfully',
  });
});

module.exports = app;