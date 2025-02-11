const reviewService = require('../services/review.service');
//import mongoseee
const mongoose = require('mongoose');
const userModel = require('../models/user');
const productModel = require('../models/product');
const { bucket } = require('../dbs/firebase');
class reviewController {
    async createReview(req, res) {
        const { content, rating, userId, productId, imageUrls } = req.body;

        try {
            // Validate user existence
            const userDetail = await userModel.findById(userId);
            if (!userDetail) {
                return res.status(404).json({ message: "User not found" });
            }

            // Validate product existence
            const productDetail = await productModel.findById(productId);
            if (!productDetail) {
                return res.status(404).json({ message: "Product not found" });
            }

            // Ensure imageUrls is flattened and valid
            const flatImageUrls = Array.isArray(imageUrls) ? imageUrls.flat() : [];

            // Create review object
            const review = {
                content,
                rating,
                productId: new mongoose.Types.ObjectId(productId),
                userId: new mongoose.Types.ObjectId(userId),
                imageUrls: flatImageUrls, // Flattened imageUrls
            };

            // Save the review in the database
            const createdReview = await reviewService.createReview(review);

            // Check if the product's rating is currently null
            if (productDetail.rating === null) {
                // Update the product's rating directly with the current review's rating
                await productModel.findByIdAndUpdate(
                    productId,
                    { rating: rating },
                    { new: true }
                );

                return res.status(201).json({
                    message: 'Review created successfully! (Direct rating update)',
                    createdReview,
                    averageRating: rating, // Directly return the current rating as average
                });
            }

            // If product already has a rating, calculate the average rating
            const allReviews = await reviewService.getReviewsByProductId(productId);
            const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / allReviews.length;

            // Update the product's rating with the calculated average
            await productModel.findByIdAndUpdate(
                productId,
                { rating: averageRating },
                { new: true }
            );

            // Send the created review back as a response
            return res.status(201).json({
                message: 'Review created successfully!',
                createdReview,
                averageRating,
            });

        } catch (error) {
            return res.status(500).json({ message: 'Error creating review', error: error.message });
        }
    }

    // async getreviewById(req, res) {
    //     try {
    //         const reviewId = req.params.id;
    //         const review = await reviewService.getreviewById(reviewId);
    //         if (!review) {
    //             res.status(404).json({ message: 'review not found' });
    //         } else {
    //             res.status(200).json(review);
    //         }
    //     } catch (error) {
    //         res.status(500).json({ message: 'Error fetching review', error: error.message });
    //     }
    // }
    async getReviewById(req, res) {
        const reviewId = req.params.id;
        try {
            const review = await reviewService.getReviewById(reviewId);
            if (!review) {
                return res.status(404).send({ message: 'review not found' });
            }
            return res.status(200).send(review);
        } catch (error) {
            return res.status(500).send(error);
        }
    }
    async getListReviews(req, res) {
        try {
            const { productId } = req.query; // Lấy productId từ query string
            let reviews;

            if (productId) {
                // Nếu có productId, chỉ lấy các review của sản phẩm đó
                reviews = await reviewService.getReviewsByProductId(productId);
            } else {
                // Nếu không có productId, lấy tất cả các review
                reviews = await reviewService.getReviews();
            }

            return res.status(200).json({ success: true, data: reviews });
        } catch (error) {
            return res.status(500).json({
                message: 'Error fetching reviews',
                success: false,
                error: error.message
            });
        }
    }

    async updateReview(req, res) {
        try {
            const reviewId = req.params.id;
            const { content, imageUrl, rating, productId, userId } = req.body;
            let missingFields = [];

            // Kiểm tra các trường bắt buộc
            if (!content) missingFields.push('content');
            if (!rating) missingFields.push('rating');
            if (!productId) missingFields.push('productId');
            if (!userId) missingFields.push('userId');

            if (missingFields.length > 0) {
                return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
            }

            // Kiểm tra tính hợp lệ của userId và productId
            const userDetail = await userModel.findById(userId);
            if (!userDetail) {
                return res.status(404).json({ message: "User not found" });
            }

            const productDetail = await productModel.findById(productId);
            if (!productDetail) {
                return res.status(404).json({ message: "Product not found" });
            }

            // Lấy thông tin đánh giá cũ từ database
            const review = await reviewService.getReviewById(reviewId);
            if (!review) {
                return res.status(404).json({ message: "Review not found" });
            }

            // Giữ lại ảnh cũ và thêm ảnh mới (nếu có)
            const updatedImages = [...review.imageUrls, ...imageUrl]; // Giữ lại ảnh cũ và thêm ảnh mới

            // Dữ liệu mới để cập nhật
            const newData = {
                content,
                imageUrls: updatedImages,
                rating,
                userId: new mongoose.Types.ObjectId(userId),
                productId: new mongoose.Types.ObjectId(productId),
                updated_at: Date.now() // Cập nhật thời gian sửa đổi
            };

            // Cập nhật đánh giá
            const updatedReview = await reviewService.updateReview(reviewId, newData);
            return res.status(200).json(updatedReview);

        } catch (error) {
            return res.status(500).json({ message: 'Error updating review', error: error.message });
        }
    }




    async deleteReview(req, res) {
        try {
            const reviewId = req.params.id;
            const deletedreview = await reviewService.deleteReviewAndUserUpdate(reviewId);
            res.status(200).json(deletedreview);
        } catch (error) {
            res.status(500).json({ message: 'Error deleting review', error: error.message });
        }
    }
    async lockReview(req, res) {
        try {
            const reviewId = req.params.id;
            const { isLocked } = req.body; // Lấy giá trị mới từ payload

            // Kiểm tra giá trị isLocked có tồn tại không
            if (typeof isLocked !== 'boolean') {
                return res.status(400).json({ message: 'Invalid isLocked value' });
            }
            const updatedReview = await reviewService.updateReviewLockState(reviewId, isLocked);
            if (!updatedReview) {
                return res.status(404).json({ message: 'Review not found' });
            }

            res.status(200).json(updatedReview);
        } catch (error) {
            res.status(500).json({ message: 'Error updating review lock state', error: error.message });
        }
    }


}

module.exports = new reviewController();
