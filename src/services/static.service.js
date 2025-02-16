const cron = require('node-cron');
const Statistics = require('../models/static'); // Import model thống kê
const Order = require('../models/order'); // Import model đơn hàng
const StockEntry = require('../models/stockEntry'); // Import model nhập hàng
const productModel = require('../models/product');
const categoryModel = require('../models/category')
const inventoryModel = require('../models/inventory')
// Hàm thống kê và lưu dữ liệu cho tháng
const generateStatisticsForMonth = async (year, month) => {
  try {
    // Kiểm tra xem thống kê tháng này đã có chưa
    const existingStatistics = await Statistics.findOne({
      "value.year": year,
      "value.month": month,
      type: 'monthly'
    });

    if (existingStatistics) {
      console.log(`Thống kê tháng ${month}/${year} đã tồn tại.`);
      return existingStatistics.value; // Trả về thống kê hiện tại nếu đã tồn tại
    }

    const startDate = new Date(year, month - 1, 1); // Ngày bắt đầu tháng
    const endDate = new Date(year, month, 0); // Ngày cuối tháng

    const orders = await Order.find({
      created_at: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const stockEntries = await StockEntry.find({
      entryDate: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate('inventories'); // 'inventories' là tên trường chứa ID trong StockEntry model

    const totalOrders = orders.length;
    const cancelledOrders = orders.filter(order => order.currentStatus === 'Canceled').length;
    const totalRevenue = orders
      .filter(order => order.currentStatus === 'Delivered')
      .reduce((sum, order) => sum + order.totalAmount, 0);
    const totalDiscount = orders.reduce((sum, order) => sum + (order.discountAmount || 0), 0);

    // Tính total initialAmount chỉ với các đơn hàng có trạng thái 'Delivered'
    const initialAmount = orders
      .filter(order => order.currentStatus === 'Delivered')  // Chỉ tính các đơn hàng đã giao
      .reduce((sum, order) => sum + order.subtotalAmount, 0);

    const totalCapitalPrice = stockEntries.reduce((sum, entry) => {
      if (!entry.inventories || !Array.isArray(entry.inventories)) {
        console.log(`Entry inventories không hợp lệ tại tháng ${month}/${year}:`, entry);
        return sum; // Bỏ qua entry không hợp lệ
      }

      return (
        sum +
        entry.inventories.reduce((inventorySum, inventory) => {
          const capitalPrice = parseFloat(inventory.capitalPrice) || 0; // Giá trị mặc định là 0 nếu không hợp lệ
          const quantity = parseInt(inventory.quantity, 10) || 0; // Giá trị mặc định là 0 nếu không hợp lệ
          return inventorySum + capitalPrice * quantity;
        }, 0)
      );
    }, 0);

    // Lưu thống kê cho tháng
    const newStatistics = new Statistics({
      type: 'monthly',
      value: {
        year,
        month,
        totalOrders,
        cancelledOrders,
        totalRevenue,
        totalDiscount,
        initialAmount,
        totalCapitalPrice,
      },
    });

    await newStatistics.save();
    console.log(`Thống kê tháng ${month}/${year} đã lưu.`);
    return newStatistics.value;
  } catch (error) {
    console.error(`Lỗi khi thống kê tháng ${month}/${year}:`, error);
    return { totalOrders: 0, cancelledOrders: 0, totalRevenue: 0, totalDiscount: 0, initialAmount: 0, totalCapitalPrice: 0 }; // Trả về giá trị mặc định khi có lỗi
  }
};

// Hàm thống kê theo quý
const generateStatisticsForQuarter = async (year, quarter) => {
  try {
    const monthsInQuarter = {
      1: [1, 2, 3],  // Quý 1: Tháng 1-3
      2: [4, 5, 6],  // Quý 2: Tháng 4-6
      3: [7, 8, 9],  // Quý 3: Tháng 7-9
      4: [10, 11, 12], // Quý 4: Tháng 10-12
    };

    const months = monthsInQuarter[quarter];

    // Kiểm tra xem thống kê quý này đã tồn tại chưa
    const existingQuarterStatistics = await Statistics.findOne({
      "value.year": year,
      "value.quarter": quarter,
      type: 'quarterly'
    });

    if (existingQuarterStatistics) {
      console.log(`Thống kê quý ${quarter}/${year} đã tồn tại.`);
      return existingQuarterStatistics.value; // Trả về thống kê hiện tại nếu đã tồn tại
    }

    let totalOrders = 0;
    let cancelledOrders = 0;
    let totalRevenue = 0;
    let totalDiscount = 0;
    let initialAmount = 0;
    let totalCapitalPrice = 0;

    for (let month of months) {
      // Gọi hàm thống kê cho từng tháng trong quý
      const stats = await generateStatisticsForMonth(year, month);
      totalOrders += stats.totalOrders;
      cancelledOrders += stats.cancelledOrders;
      totalRevenue += stats.totalRevenue;
      totalDiscount += stats.totalDiscount;
      initialAmount += stats.initialAmount;
      totalCapitalPrice += stats.totalCapitalPrice;
    }

    // Lưu thống kê cho quý
    const newQuarterlyStatistics = new Statistics({
      type: 'quarterly',
      value: {
        year,
        quarter,
        totalOrders,
        cancelledOrders,
        totalRevenue,
        totalDiscount,
        initialAmount,
        totalCapitalPrice,
      },
    });

    await newQuarterlyStatistics.save();
    console.log(`Thống kê quý ${quarter}/${year} đã lưu.`);
  } catch (error) {
    console.error(`Lỗi khi thống kê quý ${quarter}/${year}:`, error);
  }
};

const generateStatisticsForYear = async (year) => {
  try {
    let totalOrders = 0;
    let cancelledOrders = 0;
    let totalRevenue = 0;
    let totalDiscount = 0;
    let initialAmount = 0;
    let totalCapitalPrice = 0;

    // Lặp qua từng tháng trong năm
    for (let month = 1; month <= 12; month++) {
      const monthlyStats = await generateStatisticsForMonth(year, month);

      // Cộng dồn các giá trị thống kê từ từng tháng
      totalOrders += monthlyStats.totalOrders;
      cancelledOrders += monthlyStats.cancelledOrders;
      totalRevenue += monthlyStats.totalRevenue;
      totalDiscount += monthlyStats.totalDiscount;
      initialAmount += monthlyStats.initialAmount;
      totalCapitalPrice += monthlyStats.totalCapitalPrice;
    }

    // Lưu thống kê cho năm
    const newYearlyStatistics = new Statistics({
      type: 'yearly',
      value: {
        year,
        totalOrders,
        cancelledOrders,
        totalRevenue,
        totalDiscount,
        initialAmount,
        totalCapitalPrice,
      },
    });

    await newYearlyStatistics.save();
    console.log(`Thống kê năm ${year} đã lưu.`);
  } catch (error) {
    console.error(`Lỗi khi thống kê năm ${year}:`, error);
  }
};
// Lên lịch cron để chạy vào ngày 1 mỗi tháng lúc 00:00
// cron.schedule('0 0 1 * *', () => {
//   const now = new Date();
//   console.log(`Chạy thống kê lúc: ${now.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`);
//   generateStatisticsForMonth(now.getFullYear(), now.getMonth() + 1);
// }, {
//   scheduled: true,
//   timezone: "Asia/Ho_Chi_Minh"
// });

cron.schedule('40 10 16 2 *', () => {
  const now = new Date();
  console.log(`Chạy thống kê lúc: ${now.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`);
  generateStatisticsForMonth(now.getFullYear(), now.getMonth() + 1);
}, {
  scheduled: true,
  timezone: "Asia/Ho_Chi_Minh"
});

cron.schedule('0 0 * * * *', async () => { // Chạy mỗi giờ một lần
  try {
      const now = new Date();
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

      const expiredProducts = await productModel.find({
          isDelete: true,
          delete_at: { $lte: threeDaysAgo } // Chỉ xóa nếu delete_at + 3 ngày <= hiện tại
      });

      for (const product of expiredProducts) {
          const inventory = await inventoryModel.findOne({ productId: product._id });

          if (!inventory || inventory.quantity === 0) {
              await categoryModel.updateMany(
                  { _id: { $in: product.categoryId } },
                  { $pull: { products: product._id } }
              );

              await productModel.deleteOne({ _id: product._id });

              console.log(`Deleted product: ${product.name}`);
          } else {
              console.log(`Cannot delete product ${product.name} because quantity is ${inventory.quantity}`);
          }
      }
  } catch (error) {
      console.error('Error deleting expired soft-deleted products:', error);
  }
});

// Lên lịch cron để chạy thống kê theo quý vào cuối mỗi quý (31 tháng 3, 30 tháng 6, 30 tháng 9, 31 tháng 12)
cron.schedule('0 0 31 3,6,9,12 *', () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  let quarter;
  if (month <= 3) quarter = 1;
  else if (month <= 6) quarter = 2;
  else if (month <= 9) quarter = 3;
  else quarter = 4;

  console.log(`Chạy thống kê cho quý ${quarter}/${year}...`);
  generateStatisticsForQuarter(year, quarter);
});

cron.schedule('0 0 31 12 *', () => {
  const now = new Date();
  const year = now.getFullYear();

  console.log(`Chạy thống kê cho năm ${year}...`);
  generateStatisticsForYear(year);
});

// const testGenerateQuarterlyStatisticsFor2024 = async (quarter) => {
//   try {
//     const year = 2024;
//     console.log(`Chạy thống kê cho quý ${quarter}/${year}...`);
//     await generateStatisticsForQuarter(year, quarter); // Gọi hàm thống kê theo quý
//   } catch (error) {
//     console.error(`Lỗi khi chạy thống kê cho quý ${quarter}/${year}:`, error);
//   }
// };

// // Test: Chạy thống kê cho quý 1, quý 2, quý 3, quý 4 của năm 2024
// testGenerateQuarterlyStatisticsFor2024(1);  // Quý 1
// testGenerateQuarterlyStatisticsFor2024(2);  // Quý 2
// testGenerateQuarterlyStatisticsFor2024(3);  // Quý 3
// testGenerateQuarterlyStatisticsFor2024(4);  // Quý 4
// const testGenerateMonthlyStatistics = async (year, month) => {
//   try {
//     console.log(`Chạy thống kê cho tháng ${month}/${year}...`);
//     await generateStatisticsForMonth(year, month); // Gọi hàm thống kê theo tháng
//   } catch (error) {
//     console.error(`Lỗi khi chạy thống kê cho tháng ${month}/${year}:`, error);
//   }
// };

// testGenerateMonthlyStatistics(2024, 1);  // Tháng 1
// testGenerateMonthlyStatistics(2024, 2);  // Tháng 2
// testGenerateMonthlyStatistics(2024, 3);  // Tháng 3
// testGenerateMonthlyStatistics(2024, 4);  // Tháng 4
// testGenerateMonthlyStatistics(2024, 5);  // Tháng 5
// testGenerateMonthlyStatistics(2024, 6);  // Tháng 6
// testGenerateMonthlyStatistics(2024, 7);  // Tháng 7
// testGenerateMonthlyStatistics(2024, 8);  // Tháng 8
// testGenerateMonthlyStatistics(2024, 9);  // Tháng 9
// testGenerateMonthlyStatistics(2024, 10); // Tháng 10
// testGenerateMonthlyStatistics(2024, 11); // Tháng 11
// testGenerateMonthlyStatistics(2024, 12); // Tháng 12
// testGenerateMonthlyStatistics(2025, 1); // Tháng 12
// const testGenerateYearlyStatistics = async (year) => {
//   try {
//     console.log(`Chạy thống kê cho năm ${year}...`);
//     await generateStatisticsForYear(year); // Gọi hàm thống kê theo năm
//   } catch (error) {
//     console.error(`Lỗi khi chạy thống kê cho năm ${year}:`, error);
//   }
// };

// // Test: Chạy thống kê cho năm 2024
// testGenerateYearlyStatistics(2024);  // Năm 2024
