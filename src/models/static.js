const mongoose = require('mongoose');

const StatisticsSchema = new mongoose.Schema({
  type: { type: String, required: true }, // Loại thống kê, ví dụ: "discountedOrders"
  value: { type: mongoose.Schema.Types.Mixed, required: true }, // Giá trị linh hoạt: Object, Array, Number, etc.
  createdAt: { type: Date, default: Date.now }, // Thời điểm lưu
});

module.exports = mongoose.model('Statistics', StatisticsSchema);
