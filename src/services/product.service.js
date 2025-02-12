const productModel = require('../models/product');

const inventoryModel = require('../models/inventory');

const { default: mongoose } = require('mongoose');
const cron = require('node-cron');
// Đặt cron.schedule ở đầu file hoặc trong file cron.js

class ProductService {
    // async createProduct(data) {
    //     try {
    //         const { image, images, categoryId } = data;
    //         // Log dữ liệu đầu vào
    //         const imageUrls = [];

    //         // Helper function to upload a base64 image and return its URL
    //         const uploadImage = async (base64Image, fileName) => {
    //             console.log(`Uploading image: ${fileName}`);
    //             try {
    //                 const buffer = Buffer.from(base64Image.split(',')[1], 'base64');
    //                 console.log('Buffer created for:', fileName);

    //                 const file = bucket.file(`products/${fileName}`);
    //                 console.log(`Saving file to bucket: products/${fileName}`);

    //                 await file.save(buffer, {
    //                     metadata: { contentType: 'image/jpeg' },
    //                 });
    //                 console.log('File saved successfully:', fileName);

    //                 await file.makePublic();  // Make the file publicly accessible
    //                 console.log('File made public:', fileName);

    //                 return file.publicUrl();  // Return the public URL for storage
    //             } catch (error) {
    //                 console.error('Error uploading image:', fileName, error);
    //                 throw error;
    //             }
    //         };

    //         // Upload main image
    //         console.log('Uploading main image...');
    //         const mainImageUrl = await uploadImage(image, `main_${Date.now()}.jpg`);
    //         console.log('Main image uploaded:', mainImageUrl);

    //         // Upload additional images concurrently using Promise.all
    //         console.log('Uploading additional images...');
    //         const imageUploadPromises = images.map((img, idx) =>
    //             uploadImage(img, `image_${Date.now()}_${idx}.jpg`)
    //         );

    //         const additionalImageUrls = await Promise.all(imageUploadPromises);
    //         console.log('Additional images uploaded:', additionalImageUrls);

    //         // Combine the URLs
    //         const productData = {
    //             ...data,
    //             mainImage: mainImageUrl,
    //             images: additionalImageUrls,
    //         };
    //         console.log('Final product data:', productData);

    //         // Save product data to database
    //         const product = await productModel.create(productData);
    //         console.log('Product created successfully:', product);

    //         return product;
    //     } catch (error) {
    //         console.error('Error in createProduct:', error);
    //         throw error;  // Rethrow error for higher level handling
    //     }
    // }
    async createProduct(data) {
        try {
            console.log('Received product data:', data);

            // Save product data to the database directly
            const product = await productModel.create(data);

            console.log('Product created successfully:', product);
            return product;
        } catch (error) {
            console.error('Error in createProduct:', error);
            throw error;  // Rethrow the error for higher-level handling
        }
    }


    async getProducts(query) {
        try {
            const {
                page = 1,
                limit = 10,
                id,
                name,
                category,
                supplier,
                minPrice,
                maxPrice,
                sortBy,
                created,
                inStock,
                rating
            } = query;

            // Build query object
            let searchQuery = {
                isDelete: { $ne: true }
            };
            if (id) {
                searchQuery._id = new mongoose.Types.ObjectId(id);
            }

            if (name) {
                searchQuery.name = { $regex: name, $options: 'i' };
            }

            // Handle category as an array for multiple selections
            if (category && Array.isArray(category) && category.length > 0) {
                searchQuery.categoryId = { $in: category };
            } else if (category) {
                searchQuery.categoryId = category;
            }
            if(rating){
                searchQuery.rating = rating
            }
            if (supplier) {
                searchQuery.supplierId = supplier;
            }
            if (minPrice || maxPrice) {
                searchQuery.price = {};
                if (minPrice) searchQuery.price.$gte = minPrice;
                if (maxPrice) searchQuery.price.$lte = maxPrice;
            }
            if (created) {
                const createdDate = new Date(created);
                searchQuery.created_at = {
                    $gte: new Date(createdDate.setHours(0, 0, 0, 0)),
                    $lt: new Date(createdDate.setHours(23, 59, 59, 999)),
                };
            }

            const products = await productModel
                .find(searchQuery)
                .populate('reviews')
                .sort(sortBy ? { [sortBy.split(':')[0]]: sortBy.split(':')[1] === 'desc' ? -1 : 1 } : { created_at: -1 })
                .skip((page - 1) * limit)
                .limit(Number(limit))
                .lean();

            const productIds = products.map((product) => product._id);
            const inventories = await inventoryModel.find({ productId: { $in: productIds } }).lean();

            const inventoryMap = inventories.reduce((map, inv) => {
                map[inv.productId] = {
                    quantity: inv.quantity,
                    inStock: inv.quantity > 0,
                    capitalPrice: inv.capitalPrice,
                };
                return map;
            }, {});

            products.forEach((product) => {
                const inventory = inventoryMap[product._id];
                product.inventory = inventory || {
                    quantity: 0,
                    inStock: false,
                    capitalPrice: null,
                };
            });

            if (inStock !== undefined) {
                const isStockFiltered = products.filter((product) => product.inventory.inStock === (inStock === 'true'));
                return {
                    products: isStockFiltered,
                    total: isStockFiltered.length,
                    totalPages: Math.ceil(isStockFiltered.length / limit),
                    page,
                    limit,
                };
            }

            const total = await productModel.countDocuments(searchQuery);
            const totalPages = Math.ceil(total / limit);

            return { products, total, totalPages, page, limit };
        } catch (error) {
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await productModel
                .findById(id)
                .populate('reviews')
                .populate({ path: 'supplierId', select: 'name' })
                .populate({ path: 'categoryId', select: 'name' })
                .lean();

                if (!product || product.isDelete === true) {
                    const error = new Error('Product not found');
                    error.statusCode = 404;
                    throw error;
                }
            // Lấy thông tin từ Inventory
            const inventory = await inventoryModel.findOne({ productId: id }).lean();
            product.inventory = inventory ? { quantity: inventory.quantity, capitalPrice: inventory.capitalPrice } : null;

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
async softDeleteProduct(req, res) {
    try {
        const productId = req.params.id;
        const product = await ProductService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Cập nhật isDelete và delete_at
        const deleteAt = new Date();
        deleteAt.setDate(deleteAt.getDate() + 3); // Cộng 3 ngày
        const updatedProduct = await ProductService.softDeleteProduct(productId, deleteAt);

        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating product for deletion', error: error.message });
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
    async updateProductsWithSale(productIds, sale) {
        try {
          // Tìm tất cả sản phẩm theo danh sách productIds
          const products = await productModel.find({ _id: { $in: productIds } });

          // Tạo một mảng promise để cập nhật từng sản phẩm
          const updatePromises = products.map((product) => {
            const originalPrice = product.originalPrice || product.price;  // Sử dụng originalPrice nếu có, nếu không thì dùng giá hiện tại
            const newPrice = originalPrice * ((100 - sale) / 100);         // Tính giá mới sau khi giảm

            // Cập nhật sale và price cho từng sản phẩm
            return productModel.findByIdAndUpdate(
              product._id,
              { sale: sale, price: newPrice.toFixed(2) }, // Cập nhật sale và làm tròn giá
              { new: true }
            );
          });

          // Đợi tất cả các promise hoàn thành
          const updatedProducts = await Promise.all(updatePromises);

          return updatedProducts;
        } catch (error) {
          throw error;  // Để controller xử lý lỗi
        }
      }


    async softDeleteProduct(id, deleteAt) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(
                id,
                { isDelete: true, delete_at: deleteAt },
                { new: true } // Trả về sản phẩm đã cập nhật
            );
            return updatedProduct;
        } catch (error) {
            throw error;
        }
    }
    async getBestSellingProducts(limit = 10) {
        try {
            // Tìm các sản phẩm và sắp xếp theo `sold` giảm dần
            const products = await productModel
                .find({ sold: { $gt: 0 } }) // Lọc các sản phẩm đã bán ít nhất 1
                .sort({ sold: -1 })         // Sắp xếp giảm dần theo số lượng bán
                .limit(limit)               // Giới hạn số lượng kết quả trả về
                .lean();

            return products;
        } catch (error) {
            throw error;
        }
    }
    async getProductsByCategory(categoryId, limit = 10) {
        try {
            // Ensure that the limit is a positive integer
            if (limit <= 0) {
                throw new Error('Limit must be a positive number');
            }

            // Query products where categoryId exists in the category array and apply limit
            const products = await productModel.find({
                categoryId: { $in: [categoryId] }
            })
            .limit(limit) // Limit the number of products returned
            .exec();

            return products;
        } catch (error) {
            throw new Error('Error fetching products by category: ' + error.message);
        }
    }
    async UpdateRating() {
        try {
            // Tìm tất cả các sản phẩm có thuộc tính rating = 0
            const products = await productModel.find({ rating: 0 });

            // Nếu không có sản phẩm nào cần cập nhật, kết thúc hàm
            if (products.length === 0) {
                console.log("Không có sản phẩm nào có rating bằng 0 để cập nhật.");
                return;
            }

            // Cập nhật tất cả các sản phẩm có rating = 0 để set rating thành null
            const updateResult = await productModel.updateMany(
                { rating: 0 },
                { $set: { rating: null } }
            );

            console.log(`Đã cập nhật ${updateResult.modifiedCount} sản phẩm từ rating = 0 thành null.`);
        } catch (error) {
            console.error("Đã xảy ra lỗi khi cập nhật rating:", error);
        }
    }
    async getIsDelete() {
        try {
            // Tìm tất cả sản phẩm có isDelete: true
            const deletedProducts = await productModel.find({ isDelete: true }).lean();

            return deletedProducts; // Trả về danh sách sản phẩm bị xóa mềm
        } catch (error) {
            throw new Error('Error fetching deleted products: ' + error.message);
        }
    }

}

module.exports = new ProductService();
