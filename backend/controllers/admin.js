const io = require('../socket');
const Product = require('../models/product');

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
    io.getIO().emit('newProduct', {action: 'newProduct', product: prod});
    res.status(201).json({message: "Post added successfully"});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}