const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = (req, res, next) => {
  console.log(req.body);
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      console.log("TCL: user", user);
      user.save()
        .then(result => {
          res.status(201).json({
            message: "user created successfully",
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            message: 'Invalid authentication credentials!',
          });
        });
    });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (!user) {
      return res.status(401).json({
        message: 'Authentication Failed'
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  }).then(result => {
    if (!result) {
      return res.status(401).json({
        message: 'Authentication Failed'
      });
    }

    const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, 'secret_this_should_be_longer', { expiresIn: '1h' });

    res.status(200).json({
      message: 'Authentication Successful',
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id,
    });
  })
    .catch(err => {
      return res.status(401).json({
        message: 'Invalid authentication credentials!',
        result: err
      });
    });
};