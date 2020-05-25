const Product = require('../models/product');

exports.addProduct = (req, res, next) => {
  const image = req.protocol + "://" + req.get("host");
  const title = req.body.title;
  const price = req.body.price;
  const product = new Product({
    title: title,
    price: price,
    image: image + "/images/" + req.file.filename
  });
  product
    .save()
    .then(result => {
      res.status(201).json({
        message: "Post added successfully"
      });
    })
    .catch(err => {
      console.log(err);
    });
}