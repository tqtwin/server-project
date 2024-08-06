const productModel = require('../models/product');

class ProductService {
    async createProduct(data) {
        try {
            const product = await productModel.create(data);
            return product;
        } catch (error) {
            throw error;
        }
    }

    async getProducts(query) {
        try {
            const { page = 1, limit = 10, name, category, minPrice, maxPrice, sortBy } = query;
            // Build query object
            let searchQuery = {};

            if (name) {
                searchQuery.name = { $regex: name, $options: 'i' }; // Case insensitive search
            }

            if (category) {
                searchQuery.category = category;
            }

            if (minPrice || maxPrice) {
                searchQuery.price = {};
                if (minPrice) searchQuery.price.$gte = minPrice;
                if (maxPrice) searchQuery.price.$lte = maxPrice;
            }
            // Build sort object
            let sortQuery = {};
            if (sortBy) {
                const [key, order] = sortBy.split(':');
                sortQuery[key] = order === 'desc' ? -1 : 1;
            } else {
                sortQuery.created_at = -1; // Default to sorting by creation date (newest first)
            }

            const products = await productModel.find(searchQuery)
                .sort(sortQuery)
                .skip((page - 1) * limit)
                .limit(Number(limit));

            const total = await productModel.countDocuments(searchQuery);

            return { products, total, page, limit };
        } catch (error) {
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await productModel.findById(id);
            return product;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, data) {
        try {
            const product = await productModel.findByIdAndUpdate(id, data, { new: true });
            return product;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            await productModel.findByIdAndDelete(id);
            return { message: 'Product deleted successfully' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ProductService();
