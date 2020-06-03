const Product = require('../models/product');
const User = require('../models/user');

exports.getProduct = async (req, res, next) => {
  try {
    const prod = await Product.find();
    res.status(200).json({
      message: 'Fetched product successfully.',
      product: prod
    });
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.addToCart = async (req, res, next) => {
  try {
    const user = await User.findOne({_id: req.body.userId});
    const prod = await Product.findById(req.body.productId);
    user.addToCart(prod);
    res.status(200).json({
      message: 'Product add in cart!'
    });
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.productInCart = async (req, res, next) => {
  try {
    const user = await User.findOne({_id: req.query.id});
    const inCart = await user.populate('cart.items.productId').execPopulate();
    res.status(200).json({
      message: 'Product in cart!',
      product: inCart.cart.items
    });
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.deleteCartProduct = async (req, res, next) => {
  const userId = req.body.userId;
  const prodId = req.body.prodId;
  try {
    const user = await User.findOne({_id: userId});
    const del = await user.deleteItemFromCart(prodId);
    res.status(200).json({
      message: 'Product delete!'
    });
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.orderCreate = async (req, res, next) => {
  const userId = req.body.userId;
  const sum = req.body.sum;
  try {
    const user = await User.findOne({admin: true})
    user.addToOrder(userId, sum);
    res.status(200).json({
      message: 'Order create!'
    });
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
