const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.post('/api/posts', (req, res, next) => {
  const posts = req.body;
  console.log(posts);
  res.status(201).json({
    message: 'post added successfully'
  });
});

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