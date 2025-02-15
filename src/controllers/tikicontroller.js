const axios = require('axios');
const Product = require('../models/product'); // Import Product model
const Category = require('../models/category'); // Import Category model

// URL của trang Tiki bạn muốn lấy dữ liệu
const url = 'https://tiki.vn/api/personalish/v1/blocks/listings?limit=10&sort=top_seller&page=1&urlKey=so-tay-so-ghi-chep&category=1899';
const productDetailUrl = 'https://tiki.vn/api/v2/products/';

// Hàm fetchProductDetails để lấy chi tiết sản phẩm từ API
async function fetchProductDetails(product) {
    try {
        const { data } = await axios.get(`${productDetailUrl}${product.id}?platform=web&spid=${product.id + 1}&version=3`);
        return {
            ...product,
            description: data.short_description || "Sản phẩm từ Tiki",
            images: data.images ? data.images.map(img => img.medium_url) : [product.image]
        };
    } catch (error) {
        console.error(`Lỗi khi lấy chi tiết sản phẩm ${product.id}:`, error);
        return product;
    }
}

// Hàm fetchData để lấy dữ liệu từ Tiki và lưu vào MongoDB
async function fetchData(req, res) {
    try {
        // Gửi request đến API Tiki
        const { data } = await axios.get(url);
        const productsFromTiki = data.data; // Giả sử dữ liệu của bạn nằm trong `data.data`

        // ID của danh mục cần cập nhật
        const categoryId = '674fb12b5b8b06e41948184e';

        // Tạo mảng sản phẩm dựa trên dữ liệu từ API
        const productList = productsFromTiki.map(product => ({
            name: product.name,
            price: product.price,
            image: product.thumbnail_url,
            sale: product.discount_rate,
            categoryId: [categoryId], // Gán danh mục cho sản phẩm
            supplierId: '670742a74b0cc0d974335d05'
        }));

        // Lấy thông tin chi tiết từng sản phẩm
        const detailedProducts = await Promise.all(productList.map(fetchProductDetails));

        // Lưu mảng sản phẩm vào MongoDB
        const savedProducts = await Product.insertMany(detailedProducts);

        // Lấy danh sách `_id` của sản phẩm vừa lưu
        const productIds = savedProducts.map(product => product._id);

        // Cập nhật danh mục bằng cách thêm `_id` của sản phẩm vào `products[]`
        await Category.findByIdAndUpdate(categoryId, {
            $push: { products: { $each: productIds } }
        });

        res.status(200).json({ message: 'Data fetched and saved to database successfully', products: savedProducts });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ Tiki:', error);
        res.status(500).json({ error: 'Failed to fetch data from Tiki' });
    }
}

// Xuất hàm fetchData để sử dụng trong router
module.exports = fetchData;
