const express = require('express');
const controllers = require('../controllers/controllers');
const checkAuth = require("../route-protector/auth");

const router = express.Router();

router.get('/get-products', checkAuth, controllers.getProducts);

router.patch('/add-cart-product', checkAuth, controllers.addToCart);

router.get('/get-cart-product/:id', checkAuth, controllers.productInCart);

router.post('/delete-cart-product', checkAuth, controllers.deleteCartProduct);

router.patch('/order-create', checkAuth, controllers.orderCreate);

router.get('/all-order/:id', checkAuth, controllers.allOrder);

router.patch('/delete-order', checkAuth, controllers.deleteOrder);

module.exports = router;
