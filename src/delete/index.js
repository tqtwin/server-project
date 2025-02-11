const cron = require('node-cron');
const Product = require('../models/product'); // Đường dẫn tới model Product

// Công việc cron chạy mỗi ngày lúc 00:00
cron.schedule('0 0 * * *', async () => {
    console.log('Running cleanup job...');
    const now = new Date();

    try {
        // Tìm và xóa các sản phẩm đã quá hạn
        const deletedProducts = await Product.deleteMany({
            isDelete: true,
            delete_at: { $lte: now }, // Ngày xóa <= ngày hiện tại
        });
        console.log(`Deleted ${deletedProducts.deletedCount} products.`);
    } catch (error) {
        console.error('Error running cleanup job:', error);
    }
});
