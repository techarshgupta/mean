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
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

// saving the post to DB
app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  res.status(201).json({
    message: 'post added successfully'
  });
});

// fetching the posts from DB
app.use('/api/posts', (req, res, next) => {
  const posts = [{
      id: 'sfse23we',
      title: 'first server side posts',
      content: 'this is coming from backend'
    },
    {
      id: 'weewwwww32',
      title: 'second server side posts',
      content: 'this is coming from backend'
    },
    {
      id: '3234234',
      title: 'third  server side posts',
      content: 'this is coming from backend'
    },
  ];
  res.status(200).json({
    message: 'posts fetched successfully',
    posts: posts,
  });
});

module.exports = app;