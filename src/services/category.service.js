const categoryModel = require('../models/category');

class CategoryService {
    async createCategory(data) {
        try {
            const category = await categoryModel.create(data);
            return category;
        } catch (error) {
            throw error;
        }
    }

    async getCategories() {
        try {
            const categories = await categoryModel.find();
            return categories;
        } catch (error) {
            throw error;
        }
    }

    async getCategoryById(id) {
        try {
            const category = await categoryModel.findById(id);
            return category;
        } catch (error) {
            throw error;
        }
    }

    async updateCategory(id, data) {
        try {
            const category = await categoryModel.findByIdAndUpdate(id, data, { new: true });
            return category;
        } catch (error) {
            throw error;
        }
    }

    async deleteCategory(id) {
        try {
            await categoryModel.findByIdAndDelete(id);
            return { message: 'Category deleted successfully' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CategoryService();
