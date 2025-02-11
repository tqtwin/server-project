const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config(); // Load environment variables from .env file

// Yêu cầu file ConnectMongo để kết nối MongoDB
const ConnectMongo = require('../dbs/mongo');

// Yêu cầu Product model để lưu dữ liệu vào MongoDB
const Product = require('../models/product');

// URL của trang Tiki mà bạn muốn lấy dữ liệu
const url = 'https://tiki.vn/api/personalish/v1/blocks/listings?limit=10&sort=top_seller&page=1&urlKey=but-viet-van-phong&category=1864'; // Cập nhật URL của bạn

async function fetchData() {
    try {
        // Gửi yêu cầu GET đến Tiki
        const { data } = await axios.get(url);

        // Lấy dữ liệu JSON từ API Tiki
        const productsFromTiki = data.data; // Giả sử dữ liệu của bạn nằm trong `data.data`

        // Lấy danh sách sản phẩm từ Tiki
        const products = productsFromTiki.map(product => {
            const name = product.name;
            const price = product.price;
            const description = product.short_description || "Sản phẩm từ Tiki"; // Có thể tự đặt mô tả nếu thiếu
            const image = product.thumbnail_url; // Ảnh đại diện
            const images = [product.thumbnail_url]; // Có thể mở rộng nếu có thêm ảnh
            const sale = product.discount_rate; // Tính giảm giá nếu có
            const categoryId = '67170ebd039eb2beb84cd7af'; // Đặt cố định categoryId

            // Trả về đối tượng sản phẩm phù hợp với model Product
            return {
                name,
                price,
                description,
                image,
                images,
                sale,
                categoryId
            };
        });

        return products;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        return [];
    }
}

async function saveToDatabase(products) {
    try {
        // Lưu dữ liệu vào MongoDB bằng mô hình Product
        await Product.insertMany(products);
        console.log('Dữ liệu đã được lưu vào MongoDB');
    } catch (error) {
        console.error('Lỗi khi lưu dữ liệu vào MongoDB:', error);
    }
}

// Kết hợp tất cả các bước lại và chạy sau khi MongoDB đã kết nối thành công
fetchData()
    .then(products => {
        if (products.length > 0) {
            return saveToDatabase(products);
        }
    })
    .catch(err => console.error(err));
