const ProductService = require('../services/product.service');

class ProductController {
    async createProduct(req, res) {
        try {
            const product = await ProductService.createProduct(req.body);
            return res.status(201).json({ message: 'Product created successfully', success: true, data: product });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating product', success: false, error: error.message });
        }
    }

    async getProducts(req, res) {
        try {
            const { products, total, page, limit } = await ProductService.getProducts(req.query);
            return res.status(200).json({ success: true, data: products, total, page, limit });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching products', success: false, error: error.message });
        }
    }

    async getProductById(req, res) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found', success: false });
            }
            return res.status(200).json({ success: true, data: product });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching product', success: false, error: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const product = await ProductService.updateProduct(req.params.id, req.body);
            if (!product) {
                return res.status(404).json({ message: 'Product not found', success: false });
            }
            return res.status(200).json({ message: 'Product updated successfully', success: true, data: product });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating product', success: false, error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const result = await ProductService.deleteProduct(req.params.id);
            return res.status(200).json({ message: result.message, success: true });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting product', success: false, error: error.message });
        }
    }
}

module.exports = new ProductController();
