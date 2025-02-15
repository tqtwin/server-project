const categoryModel = require('../models/category');
const productModel = require('../models/product')
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
    // async cleanUpCategoryProducts() {
    //     try {
    //         const categories = await categoryModel.find(); // Lấy tất cả danh mục

    //         for (const category of categories) {
    //             const validProducts = [];

    //             for (const productId of category.products) {
    //                 const productExists = await productModel.exists({ _id: productId });
    //                 console.log(productId)
    //                 if (productExists) {
    //                     validProducts.push(productId); // Giữ lại product hợp lệ
    //                 }
    //             }
    //             // Cập nhật lại danh mục nếu có productId không hợp lệ
    //             if (validProducts.length !== category.products.length) {
    //                 await categoryModel.updateOne(
    //                     { _id: category._id },
    //                     { $set: { products: validProducts } }
    //                 );
    //                 console.log(`Updated category ${category._id}, removed invalid productIds`);
    //             }
    //         }

    //         return { message: 'Clean-up completed' };
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}

module.exports = new CategoryService();
