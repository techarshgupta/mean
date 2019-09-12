const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose'); //4VDIVneHWDmjaPY0
const uri = 'mongodb+srv://meanHar:4VDIVneHWDmjaPY0@cluster0-bhe0s.mongodb.net/node-angular?retryWrites=true&w=majority';

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/auth');

// creating the app
const app = express();

// DB Connection
mongoose.connect(uri, {
  useNewUrlParser: true
}).then(() => {
  console.log('I am connected to DB !');
}).catch(() => {
  console.log('Error to connect to DB !');
});

// parse the body for whole app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// allowing the uploads folder access
app.use('/images', express.static(path.join('backend/images')));

// fixing the CORS policy
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-*, Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use('/api/posts', postsRoutes);

app.use('/api/user', userRoutes);

module.exports = app;