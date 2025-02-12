const reviewModel = require('../models/review');
const UserModel = require('../models/user');
const productModel = require('../models/product');
const { default: mongoose } = require('mongoose');
class ReviewService {
    async createReview(data) {
        try {
            // Validate imageUrls structure (ensure it's an array)
            if (Array.isArray(data.imageUrls)) {
                data.imageUrls = data.imageUrls.flat(); // Flatten in case there are nested arrays
            } else {
                data.imageUrls = []; // Set empty if not valid
            }

            // Create the review
            const review = await reviewModel.create(data);

            // Kiểm tra xem review có tạo thành công không
            if (!review) {
                throw new Error("Review creation failed");
            }

            // Find the user and product associated with the review
            const user = await UserModel.findById(data.userId);
            const product = await productModel.findById(data.productId);

            if (!user) {
                throw new Error("User not found");
            }

            if (!product) {
                throw new Error("Product not found");
            }

            // Add the review to the user's reviews array
            user.reviews.push(review);

            // Add the review to the product's reviews array
            product.reviews.push(review);

            // Save the user and product
            await user.save();
            await product.save();

            // Return the review that was created
            return review;
        } catch (error) {
            console.error("Error creating review:", error.message);
            throw new Error("An error occurred while creating the review");
        }
    }

    async addReplyToReview(reviewId, userId, text) {
        try {
          const reply = {
            userId: new mongoose.Types.ObjectId(userId),
            text: text,
            created_at: new Date()
          };

          const updatedReview = await reviewModel.findByIdAndUpdate(
            reviewId,
            { $push: { repCmt: reply } }, // Thêm phản hồi vào mảng `repCmt`
            { new: true }
          ).populate('repCmt.userId', 'name'); // Populate để lấy thông tin người dùng

          return updatedReview;
        } catch (error) {
          throw new Error('Error adding reply to review: ' + error.message);
        }
      }

    async getReviewsByProductId(productId) {
        try {
            const reviews = await reviewModel.find({ productId }).populate('userId'); // Lọc theo productId
            return reviews;
        } catch (error) {
            throw error;
        }
    }

    async getReviewById(reviewId) {
        try {
            const review = await reviewModel.findById(reviewId).populate('userId');
            return review;
        } catch (error) {
            throw error;
        }
    }

    async getReviews() {
        try {
            const reviews = await reviewModel.find().populate('userId').populate('productId');
            return reviews;
        } catch (error) {
            throw error;
        }
    }

    async updateReview(reviewId, newData) {
        try {
            const updatedReview = await reviewModel.findByIdAndUpdate(reviewId, newData, { new: true });
            return updatedReview;
        } catch (error) {
            throw error;
        }
    }

    async deleteReviewAndUserUpdate(reviewId) {
        try {
            const deletedReview = await reviewModel.findByIdAndDelete(reviewId);
            const user = await UserModel.findOne({ reviews: reviewId });
            const product = await productModel.findOne({ reviews: reviewId });

            if (user && product) {
                user.reviews.pull(reviewId);
                product.reviews.pull(reviewId);

                await user.save();
                await product.save();
            }

            return deletedReview;
        } catch (error) {
            throw error;
        }
    }
    async updateReviewLockState(reviewId, isLocked) {
        try {
            const review = await reviewModel.findByIdAndUpdate(
                reviewId,
                { isLocked },
                { new: true } // Trả về document đã cập nhật
            );

            return review;
        } catch (error) {
            throw new Error('Error updating review lock state: ' + error.message);
        }
    }


}

module.exports = new ReviewService();
