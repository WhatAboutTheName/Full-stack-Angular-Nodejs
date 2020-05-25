const Product = require('../models/product');
const User = require('../models/user');

exports.getProduct = (req, res, next) => {
  Product.find()
    .then(product => {
      res.status(200).json({
        message: 'Fetched product successfully.',
        product: product
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

exports.addToCart = (req, res, next) => {
  User.findOne({_id: req.body.userId})
    .then(user => {
      Product.findById(req.body.productId)
        .then(prod => {
          user.addToCart(prod);
        })
        .catch(err => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        })
    })
    .then(user => {
      res.status(200).json({
        message: 'Product add in cart!'
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
}

exports.productInCart = (req, res, next) => {
  User.findOne({_id: req.query.id})
    .then(user => {
      user.populate('cart.items.productId')
      .execPopulate()
      .then(user => {
        res.status(200).json({
          message: 'Product in cart!',
          product: user.cart.items
        });
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
}

exports.deleteCartProduct = (req, res, next) => {
  const userId = req.body.userId;
  const prodId = req.body.prodId;
  User.findOne({_id: userId})
  .then(user => {
    user
      .deleteItemFromCart(prodId)
      .then(result => {
        res.status(200).json({
          message: 'Product delete!'
        });
      })
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

exports.orderCreate = (req, res, next) => {
  const userId = req.body.userId;
  const sum = req.body.sum;
  User.findOne({admin: true})
  .then(user => {
    user.addToOrder(userId, sum);
  })
  .then(result => {
    res.status(200).json({
      message: 'Order create!'
    });
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  })
}
