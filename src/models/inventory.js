const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true, // Thêm chỉ mục để tăng tốc tìm kiếm theo productId
  },
  warehouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true,
    index: true, // Thêm chỉ mục để tăng tốc tìm kiếm theo warehouseId
  },
  quantity: {
    type: Number,
    required: true, // Số lượng sản phẩm trong kho
    min: 0, // Số lượng không được âm
  },
  capitalPrice: {
    type: Number,
    required: true, // Giá vốn của sản phẩm
    min: 0, // Giá vốn không được âm
  },
  inStock: {
    type: Boolean,
    default: false, // Mặc định là false
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  last_update: {
    type: Date,
    default: Date.now,
  },
});

// Middleware trước khi lưu (pre-save): Tự động cập nhật inStock dựa trên quantity
inventorySchema.pre('save', function (next) {
  this.inStock = this.quantity > 0; // Nếu quantity > 0, inStock = true
  this.last_update = Date.now(); // Cập nhật last_update mỗi khi lưu
  next();
});

// Middleware trước khi cập nhật (pre-findOneAndUpdate): Cập nhật last_update và inStock
inventorySchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  // Nếu quantity được thay đổi, cập nhật inStock
  if (update.$set && update.$set.quantity !== undefined) {
    update.$set.inStock = update.$set.quantity > 0; // Nếu quantity > 0, inStock = true
  }

  update.$set = update.$set || {};
  update.$set.last_update = Date.now(); // Luôn cập nhật last_update
  next();
});

// Tạo model từ schema
const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
