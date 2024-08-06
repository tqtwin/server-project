const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required'] },
    description: { type: String },
    image: { type: String, required: [true, 'Image URL is required'] }
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
