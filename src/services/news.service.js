const UserModel = require('../models/user');
const NewsModel = require('../models/new');  // Đảm bảo tên model trùng khớp
const ProductModel = require('../models/product'); // Import thêm model sản phẩm

class NewsService {
    async createNews(data) {
        try {
            // Tạo bài viết mới
            const createdNews = await NewsModel.create(data);

            // Tìm người dùng và sản phẩm liên quan
            const user = await UserModel.findById(data.userId);
            if (user) {
                // Thêm bài viết vào mảng `news` của người dùng và sản phẩm
                user.news.push(createdNews);
                await user.save();
            }

            return createdNews;
        } catch (error) {
            throw error;
        }
    }

    async getNewsById(newsId) {
        try {
            const newsItem = await NewsModel.findById(newsId).populate('userId');
            return newsItem;
        } catch (error) {
            throw error;
        }
    }

    async getNews() {
        try {
            const newsList = await NewsModel.find().populate('userId');
            return newsList;
        } catch (error) {
            throw error;
        }
    }

    async updateNews(newsId, newData) {
        try {
            const updatedNews = await NewsModel.findByIdAndUpdate(newsId, newData, { new: true });
            return updatedNews;
        } catch (error) {
            throw error;
        }
    }

    async deleteNewsAndUpdateUser(newsId) {
        try {
            const deletedNews = await NewsModel.findByIdAndDelete(newsId);
            const user = await UserModel.findOne({ news: newsId });

            if (user) {
                user.news.pull(newsId);
                await user.save();
            }
            return deletedNews;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new NewsService();
