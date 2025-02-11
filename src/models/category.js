const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required'] },
    description: { type: String },
    image: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] // Thêm trường này
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
