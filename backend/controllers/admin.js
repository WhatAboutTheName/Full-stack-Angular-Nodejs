const io = require('../socket');
const Product = require('../models/product');
const User = require('../models/user');

exports.addProduct = async (req, res, next) => {
  const image = req.protocol + "://" + req.get("host");
  const title = req.body.title;
  const price = req.body.price;
  try {
    const product = new Product({
      title: title,
      price: price,
      image: image + "/images/" + req.file.filename
    });
    const prod = await product.save();
    io.getIO().emit('newProduct', {product: prod});
    res.status(201).json({message: "Post added successfully"});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.executeOrder = async (req, res, next) => {
  const userId = req.body.userId;
  const orderId = req.body.orderId;
  try {
    const user = await User.findById(userId);
    const admin = await User.findOne({admin: true});
    await admin.deleteOrder(orderId, admin.admin);
    await user.deleteOrder(orderId, user.admin);
    await user.orderStatisticsAll(true);
    res.status(200).json({message: 'Execute order!'});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}