const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    description: { type: String },
    quantity: { type: Number },
    image: { type: String },
    images: { type: [String] },
    brand: { type: String },
    review: { type: Number },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    rating: { type: Number },
    reviews: { type: [String] },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});
productSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
