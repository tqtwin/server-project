const mongoose = require('mongoose');
const StockEntry = require('./stockEntry');
const { type } = require('express/lib/response');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    capitalPrice: { type: Number},
    sold:{type:Number},
    originalPrice:{type:Number},
    description: { type: String },
    image: { type: String },
    images: { type: [String] },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    categoryId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    rating: { type: Number },
    sale: { type: Number },
    created_at: { type: Date, default: Date.now },
    last_updated: { type: Date, default: Date.now },
    isDelete: {type:Boolean , default: false},
    delete_at: {type: Date}
});

// Middleware để cập nhật danh sách sản phẩm trong danh mục
productSchema.post('save', async function(doc) {
    const Category = require('./category'); // Nhập model Category
    await Category.findByIdAndUpdate(this.categoryId, {
        $addToSet: { products: doc._id } // Thêm productId vào danh sách sản phẩm
    });
});
// Trong schema của product
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

productSchema.pre('save', function(next) {
    this.last_updated = Date.now();
    next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
