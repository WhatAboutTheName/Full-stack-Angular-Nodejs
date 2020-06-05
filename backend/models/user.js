const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    required: true,
    default: false
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  },
  orderStatistics: {
    Successful: {
      type: Number,
      required: true,
      default: 0
    },
    Unsuccessful: {
      type: Number,
      required: true,
      default: 0
    }
  },
  order: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        required: true
      },
      prodId: [{
        type: Schema.Types.ObjectId,
        required: true
      }],
      allSum: {
        type: Number,
        required: true
      },
      orderId: {
        type: Schema.Types.ObjectId,
        required: false
      }
    }
  ]
});

userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex(item => {
    return item.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteItemFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.deleteCart = function() {
  this.cart.items = [];
  return this.save();
};

userSchema.methods.addToOrder = function(userId, prodId, allSum, orderId) {
  const newOrder = [...this.order];
  newOrder.push({userId: userId, prodId: prodId, allSum: allSum, orderId: orderId});
  this.order = newOrder;
  return this.save();
}

userSchema.methods.deleteOrder = function(orderId, admin) {
  let newOrder = [];
  if (admin) {
    newOrder = this.order.filter(item => item.orderId.toString() !== orderId.toString());
  } else {
    newOrder = this.order.filter(item => item._id.toString() !== orderId.toString());
  }
  this.order = newOrder;
  return this.save();
}

userSchema.methods.orderStatisticsAll = function(value) {
  if (!value) {
    this.orderStatistics.Unsuccessful += 1;
  } else {
    this.orderStatistics.Successful += 1;
  }
  return this.save();
}

module.exports = mongoose.model('User', userSchema);