const io = require('../socket');
const Product = require('../models/product');
const User = require('../models/user');

exports.getProducts = async (req, res, next) => {
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
  const prodId = req.body.prodId;
  const allSum = req.body.allSum;
  try {
    const admin = await User.findOne({admin: true});
    const user = await User.findById(userId);
    await user.deleteCart();
    user.addToOrder(userId, prodId, allSum);
    const orderId = await user.order[user.order.length - 1]._id;
    admin.addToOrder(userId, prodId, allSum, orderId);
    res.status(200).json({message: 'Order create!'});
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.allOrder = async (req, res, next) => {
  let prodArr = [],
      data = [],
      user;
  try {
    const person = await User.findById(req.query.id);
    for (let i = 0; i < person.order.length; i++) {
      prodArr = []
      for (let z = 0; z < person.order[i].prodId.length; z++) {
        const prod = await Product.findById(person.order[i].prodId[z]);
        prodArr.push(prod);
      }
      if (person.admin) {
        user = await User.findById(person.order[i].userId);
      }
      if (person.admin) {
        data.push({
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          allSum: person.order[i].allSum,
          order: prodArr,
          userId: user._id,
          orderId: person.order[i].orderId
        });
      } else {
        data.push({
          name: person.name,
          email: person.email,
          phoneNumber: person.phoneNumber,
          allSum: person.order[i].allSum,
          order: prodArr,
          userId: person._id,
          orderId: person.order[i]._id
        });
      }
    }
    io.getIO().emit('Order', {action: 'getOrders', data: data});
    res.status(200).json({message: 'Get order!'});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.deleteOrder = async (req, res, next) => {
  let prodArr = [],
  data = [];
  const userId = req.body.userId;
  const orderId = req.body.orderId;
  const activUserId = req.body.activUserId;
  try {
    const admin = await User.findOne({admin: true});
    const user = await User.findById(userId);
    await user.orderStatisticsAll(false);
    await admin.deleteOrder(orderId, admin.admin);
    await user.deleteOrder(orderId, user.admin);
    const activUser = await User.findById(activUserId);
    for(let personOrder of activUser.order) {
      for (let i = 0; i < personOrder.prodId.length; i++) {
        const prod = await Product.findById(personOrder.prodId[i]);
        prodArr.push(prod);
      }
      data.push({
        name: activUser.name,
        email: activUser.email,
        phoneNumber: activUser.phoneNumber,
        allSum: personOrder.allSum,
        order: prodArr,
        userId: activUser._id,
        orderId: personOrder._id
      });
    }
    io.getIO().emit('Order', {action: 'deleteOrders', data: data});
    res.status(200).json({message: 'Delete order!'});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}