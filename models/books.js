const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let BookSchema = new Schema({

    isbn: String,
    name: String,
    author: String,
    price: Number

});

module.exports = mongoose.model('Book', BookSchema);