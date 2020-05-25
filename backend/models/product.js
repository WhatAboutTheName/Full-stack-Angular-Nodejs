const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    price: {
        type: String,
        require: true
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);