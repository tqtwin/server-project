const ProductService = require('../services/product.service');
const Category = require('../models/category')
const ProductModel =require('../models/product');
const productService = require('../services/product.service');
class ProductController {
    async createProduct(req, res) {
        try {
            const product = await ProductService.createProduct(req.body);
            return res.status(201).json({ message: 'Product created successfully', success: true, data: product });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating product', success: false, error: error.message });
        }
    }
    async updateAllProductsWithSale(req, res) {
        try {
          const { productIds, sale } = req.body;

          if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({
              message: 'Danh sách sản phẩm không hợp lệ.',
              success: false,
            });
          }

          if (sale < 0 || sale > 100) {
            return res.status(400).json({
              message: 'Phần trăm giảm giá phải nằm trong khoảng từ 0 đến 100.',
              success: false,
            });
          }

          const updatedProducts = await ProductService.updateProductsWithSale(productIds, sale);

          return res.status(200).json({
            message: 'Cập nhật giảm giá thành công.',
            success: true,
            data: updatedProducts,
          });
        } catch (error) {
          console.error('Error in updateAllProductsWithSale:', error);
          return res.status(500).json({
            message: 'Lỗi khi cập nhật giảm giá.',
            success: false,
            error: error.message,
          });
        }
      }


    async getProducts(req, res) {
        try {
            const {
                products,
                total,
                page,
                limit,
                totalPages
            } = await ProductService.getProducts(req.query);

            return res.status(200).json({
                success: true,
                data: products,
                total,
                page,
                limit,
                totalPages
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error fetching products',
                success: false,
                error: error.message
            });
        }
    }
    async getProductsByCategory(req, res) {
        try {
            const { categoryId } = req.params; // Get categoryId from the request parameters
            const limit = parseInt(req.query.limit, 10) || 10; // Default limit is 10 if not provided

            // Ensure the categoryId is valid
            if (!categoryId) {
                return res.status(400).json({
                    message: 'Category ID is required',
                    success: false,
                });
            }

            // Call the ProductService to get products by category with limit
            const products = await ProductService.getProductsByCategory(categoryId, limit);

            if (!products || products.length === 0) {
                return res.status(404).json({
                    message: 'No products found for this category',
                    success: false,
                });
            }

            return res.status(200).json({
                success: true,
                data: products,
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error fetching products by category',
                success: false,
                error: error.message,
            });
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
            const productId = req.params.id;
            // Lấy sản phẩm từ cơ sở dữ liệu
            const product = await ProductService.getProductById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            // Xóa productId khỏi tất cả các category mà sản phẩm thuộc về
            await Category.updateMany(
                { _id: { $in: product.categoryId } },  // Lọc các danh mục có chứa productId
                { $pull: { products: productId } }     // Xóa productId khỏi mảng products của từng danh mục
            );

            // Xóa sản phẩm khỏi cơ sở dữ liệu
            const deletedProduct = await ProductService.deleteProduct(productId);
            return res.status(200).json(deletedProduct);  // Trả về sản phẩm đã bị xóa
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting product', error: error.message });
        }
    }
    async softDeleteProduct(req, res) {
        try {
            const productId = req.params.id;
            const product = await ProductService.getProductById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Cập nhật isDelete và delete_at
            const updatedProduct = await ProductService.softDeleteProduct(productId, new Date());


            return res.status(200).json(updatedProduct);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating product for deletion', error: error.message });
        }
    }
    async restoreProduct(req, res) {
        try {
          const productId = req.params.id;
          const updatedProduct = await ProductModel.findByIdAndUpdate(
            productId,
            { isDelete: false, delete_at: null },
            { new: true }
          );
          if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
          }
          return res.status(200).json(updatedProduct);
        } catch (error) {
          return res.status(500).json({ message: 'Error restoring product', error: error.message });
        }
      }
      async getBestSellingProducts(req, res) {
        try {
            const limit = parseInt(req.query.limit, 10) || 10; // Lấy `limit` từ query hoặc mặc định là 10
            const bestSellingProducts = await ProductService.getBestSellingProducts(limit);

            return res.status(200).json({
                success: true,
                data: bestSellingProducts,
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error fetching best selling products',
                success: false,
                error: error.message,
            });
        }
    }
    async UpdateRating(req, res) {
        try {
            // Gọi service để thực hiện logic cập nhật
            const result = await productService.UpdateRating();

            // Gửi phản hồi về client
            res.status(200).json({
                success: true,
                message: `Đã cập nhật ${result.modifiedCount} sản phẩm.`,
            });
        } catch (error) {
            console.error("Lỗi trong controller UpdateRating:", error);

            // Gửi phản hồi lỗi về client
            res.status(500).json({
                success: false,
                message: "Đã xảy ra lỗi khi cập nhật rating.",
            });
        }
    }

    async getIsDelete(req, res) {
        try {
            // Gọi hàm trong service để lấy danh sách sản phẩm bị xóa mềm
            const deletedProducts = await ProductService.getIsDelete();

            // Trả về danh sách (có thể là rỗng nếu không có sản phẩm)
            return res.status(200).json({
                success: true,
                data: deletedProducts || [], // Nếu undefined hoặc null, trả về mảng rỗng
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error fetching deleted products',
                success: false,
                error: error.message,
            });
        }
    }


}

module.exports = new ProductController();
