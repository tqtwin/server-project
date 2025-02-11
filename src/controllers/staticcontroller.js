const Statistics = require('../models/static');
const Order = require('../models/order');
const Product = require('../models/product');

// Hàm lấy tất cả dữ liệu thống kê từ database
const getStatistics = async (req, res) => {
  try {
    // Lấy các tham số từ query
    const { month, year, quarter } = req.query;

    if (!year) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp năm (year) để lọc dữ liệu!',
      });
    }

    // Khởi tạo bộ lọc cơ bản
    const filter = { "value.year": Number(year) };

    // Xác định loại thống kê dựa trên tham số được gửi
    if (month) {
      filter["value.month"] = Number(month);
    } else if (quarter) {
      filter["value.quarter"] = Number(quarter);
    }

    // Tìm kiếm dữ liệu thống kê dựa trên bộ lọc
    const statistics = await Statistics.find(filter);

    // Nếu không tìm thấy dữ liệu, trả về thông báo "chưa có bảng thống kê"
    if (statistics.length === 0) {
      return res.status(202).json({
        success: true,
        message: 'Chưa có bảng thống kê phù hợp với bộ lọc hiện tại.',
        data: [], // Trả về một mảng rỗng để thể hiện không có dữ liệu
      });
    }

    // Trả về dữ liệu thống kê tìm thấy
    res.status(200).json({ success: true, data: statistics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// API lưu kết quả thống kê vào database
const saveStatistics = async (req, res) => {
  try {
    const { month, year } = req.body; // Dữ liệu từ body request
    const data = req.body;

    // Lưu vào database
    const statistics = new Statistics({
      type: 'monthly',
      value: data,
      createdAt: new Date(),
    });

    await statistics.save();
    res.status(200).json({ success: true, message: 'Statistics saved successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// API xóa kết quả thống kê từ database theo _id
const deleteStatisticsById = async (req, res) => {
  try {
    // Lấy _id từ params (URL)
    const { id } = req.params;

    // Kiểm tra _id có hợp lệ không
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp _id để xóa dữ liệu!',
      });
    }

    // Xóa dữ liệu thống kê theo _id
    const result = await Statistics.findByIdAndDelete(id);

    // Kiểm tra nếu không có dữ liệu nào bị xóa
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thống kê với _id này.',
      });
    }

    // Trả về thông báo thành công
    res.status(200).json({
      success: true,
      message: 'Thống kê đã được xóa thành công.',
      deletedId: id, // Trả về _id của bảng thống kê đã xóa
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API xóa tất cả kết quả thống kê từ database
const deleteAllStatistics = async (req, res) => {
  try {
    // Xóa tất cả dữ liệu trong collection Statistics
    const result = await Statistics.deleteMany({});

    // Kiểm tra nếu không có dữ liệu nào bị xóa
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không có thống kê nào để xóa.',
      });
    }

    // Trả về thông báo thành công
    res.status(200).json({
      success: true,
      message: 'Tất cả thống kê đã được xóa thành công.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  saveStatistics,
  getStatistics,
  deleteStatisticsById,
  deleteAllStatistics, // Thêm hàm xóa tất cả thống kê vào exports
};

