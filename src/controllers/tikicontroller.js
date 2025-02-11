// scraper.js
const axios = require('axios');
const Product = require('../models/product'); // Import Product model

// URL của trang Tiki bạn muốn lấy dữ liệu
const url = 'https://tiki.vn/api/personalish/v1/blocks/listings?limit=10&sort=top_seller&page=1&urlKey=muc-cac-loai&category=3901'; // URL bạn cần thay thế bằng API Tiki thực tế

// Hàm fetchData để lấy dữ liệu từ Tiki và lưu vào MongoDB
async function fetchData(req, res) {
    try {
        // Gửi request đến API Tiki
        const { data } = await axios.get(url);

        const productsFromTiki = data.data; // Giả sử dữ liệu của bạn nằm trong `data.data`

        // Tạo mảng sản phẩm dựa trên dữ liệu từ API
        const products = productsFromTiki.map(product => {
            const name = product.name;
            const price = product.price;
            const description = product.short_description || "Sản phẩm từ Tiki"; // Có thể tự đặt mô tả nếu thiếu
            const image = product.thumbnail_url; // Ảnh đại diện
            const images = [product.thumbnail_url]; // Có thể mở rộng nếu có thêm ảnh
            const sale = product.discount_rate; // Tính giảm giá nếu có
            const categoryId = ['67469af0fdfd09477cf8a8d3']; // Đặt cố định categoryId
            const supplierId = '670742a74b0cc0d974335d05';

            // Trả về đối tượng sản phẩm phù hợp với model Product
            return {
                name,
                price,
                description,
                image,
                images,
                sale,
                categoryId,
                supplierId
            };
        });

        // Lưu mảng sản phẩm vào MongoDB
        await Product.insertMany(products);
        res.status(200).json({ message: 'Data fetched and saved to database successfully', products });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ Tiki:', error);
        res.status(500).json({ error: 'Failed to fetch data from Tiki' });
    }
}

// Xuất hàm fetchData để sử dụng trong router
module.exports = fetchData;
