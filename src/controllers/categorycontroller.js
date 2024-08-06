const CategoryService = require('../services/category.service');

class CategoryController {
    async createCategory(req, res) {
        try {
            const category = await CategoryService.createCategory(req.body);
            return res.status(201).json({ message: 'Category created successfully', success: true, data: category });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating category', success: false, error: error.message });
        }
    }

    async getCategories(req, res) {
        try {
            const categories = await CategoryService.getCategories();
            return res.status(200).json({ success: true, data: categories });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching categories', success: false, error: error.message });
        }
    }

    async getCategoryById(req, res) {
        try {
            const category = await CategoryService.getCategoryById(req.params.id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found', success: false });
            }
            return res.status(200).json({ success: true, data: category });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching category', success: false, error: error.message });
        }
    }

    async updateCategory(req, res) {
        try {
            const category = await CategoryService.updateCategory(req.params.id, req.body);
            if (!category) {
                return res.status(404).json({ message: 'Category not found', success: false });
            }
            return res.status(200).json({ message: 'Category updated successfully', success: true, data: category });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating category', success: false, error: error.message });
        }
    }

    async deleteCategory(req, res) {
        try {
            const result = await CategoryService.deleteCategory(req.params.id);
            return res.status(200).json({ message: result.message, success: true });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting category', success: false, error: error.message });
        }
    }
}

module.exports = new CategoryController();
