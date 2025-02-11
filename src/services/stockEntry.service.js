const StockEntry = require('../models/stockEntry');
const Warehouse = require('../models/warehouse');
const Inventory = require('../models/inventory');
const Supplier = require('../models/supplier')
const mongoose = require('mongoose');

class StockEntryService {
    // async createStockEntry(data) {
    //     const { warehouseId, products, supplierId, userId } = data;

    //     try {
    //         // Tạo các bản ghi Inventory cho từng sản phẩm trong đơn nhập kho
    //         const inventories = await Promise.all(products.map(async (product) => {
    //             const { productId, quantity, capitalPrice } = product;
    //             console.log(quantity)
    //             // Kiểm tra xem sản phẩm đã tồn tại trong kho chưa
    //             let inventory = await Inventory.findOne({ warehouseId, productId });

    //             if (inventory) {
    //                 // Cập nhật số lượng và giá vốn nếu đã có sản phẩm trong kho
    //                 inventory.quantity += quantity;
    //                 inventory.capitalPrice = capitalPrice;
    //                 inventory.last_update = Date.now();
    //                 await inventory.save();
    //             } else {
    //                 // Tạo mới Inventory nếu sản phẩm chưa có trong kho
    //                 inventory = await Inventory.create({
    //                     productId,
    //                     warehouseId,
    //                     quantity,
    //                     capitalPrice
    //                 });
    //             }
    //             return inventory._id;
    //         }));

    //         // Tạo bản ghi StockEntry mới
    //         const stockEntry = await StockEntry.create({
    //             warehouseId,
    //             inventories,
    //             supplierId,
    //             userId
    //         });

    //         // Cập nhật danh sách inventories trong Warehouse
    //         const warehouse = await Warehouse.findById(warehouseId);
    //         warehouse.inventories.push(...inventories);
    //         await warehouse.save();

    //         return stockEntry;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // Các phương thức khác vẫn giữ nguyên
    async createStockEntry(data) {
        const { warehouseId, products, supplierId, userId } = data;

        try {
            // Tính tổng giá trị của đơn hàng nhập kho
            const totalAmount = products.reduce((sum, product) => {
                // Kiểm tra giá trị của quantity và capitalPrice
                if (product.quantity && product.capitalPrice) {
                    // console.log(`Product quantity: ${product.quantity}, capitalPrice: ${product.capitalPrice}`);
                    return sum + (product.quantity * product.capitalPrice);
                }
                console.error("Invalid quantity or capitalPrice", product);
                return sum; // Tránh lỗi nếu có dữ liệu không hợp lệ
            }, 0);
            // Tạo các bản ghi Inventory cho từng sản phẩm trong đơn nhập kho
            const inventories = await Promise.all(products.map(async (product) => {
                const { productId, quantity, capitalPrice } = product;

                // Kiểm tra xem sản phẩm đã tồn tại trong kho chưa
                let inventory = await Inventory.findOne({ warehouseId, productId });

                if (inventory) {
                    // Cập nhật số lượng và giá vốn nếu đã có sản phẩm trong kho
                    inventory.quantity += quantity;
                    inventory.capitalPrice = capitalPrice;
                    inventory.last_update = Date.now();
                    await inventory.save();
                } else {
                    // Tạo mới Inventory nếu sản phẩm chưa có trong kho
                    inventory = await Inventory.create({
                        productId,
                        warehouseId,
                        quantity,
                        capitalPrice
                    });
                }
                return inventory._id;
            }));

            // Tạo bản ghi StockEntry mới
            const stockEntry = await StockEntry.create({
                warehouseId,
                inventories,
                supplierId,
                userId
            });

            // Cập nhật danh sách inventories trong Warehouse
            const warehouse = await Warehouse.findById(warehouseId);
            warehouse.inventories.push(...inventories);
            await warehouse.save();

            // Cập nhật Supplier với ID của StockEntry và tổng nợ
            const supplier = await Supplier.findById(supplierId);
            if (supplier) {
                supplier.stock.push(stockEntry._id); // Thêm ID StockEntry vào danh sách stock
                supplier.totalDebt += totalAmount;    // Cộng tổng số tiền vào totalDebt
                await supplier.save();
            }

            return stockEntry;
        } catch (error) {
            throw error;
        }
    }

    async getStockEntries(query) {
        try {
            const { page = 1, limit = 10 } = query;

            const stockEntries = await StockEntry.find({})
                .populate('inventories')
                .skip((page - 1) * limit)
                .limit(Number(limit));

            const total = await StockEntry.countDocuments({});

            return { stockEntries, total, page, limit };
        } catch (error) {
            throw error;
        }
    }

    async getStockEntryById(id) {
        try {
            const stockEntry = await StockEntry.findById(id);
            return stockEntry;
        } catch (error) {
            throw error;
        }
    }

    async updateStockEntry(id, data) {
        try {
            const stockEntry = await StockEntry.findByIdAndUpdate(id, data, { new: true });
            return stockEntry;
        } catch (error) {
            throw error;
        }
    }

    async deleteStockEntry(id) {
        try {
            await StockEntry.findByIdAndDelete(id);
            return { message: 'Stock entry deleted successfully' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StockEntryService();
