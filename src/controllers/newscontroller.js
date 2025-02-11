const NewsService = require('../services/news.service');

class NewsController {
    async createNews(req, res) {
        try {
            const data = req.body;
            const newsItem = await NewsService.createNews(data);
            res.status(201).json(newsItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getNewsById(req, res) {
        try {
            const newsId = req.params.id;
            const newsItem = await NewsService.getNewsById(newsId);
            if (!newsItem) {
                return res.status(404).json({ message: 'News item not found' });
            }
            res.json(newsItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllNews(req, res) {
        try {
            const newsList = await NewsService.getNews();
            res.json(newsList);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateNews(req, res) {
        try {
            const newsId = req.params.id;
            const newData = req.body;
            const updatedNews = await NewsService.updateNews(newsId, newData);
            if (!updatedNews) {
                return res.status(404).json({ message: 'News item not found' });
            }
            res.json(updatedNews);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteNews(req, res) {
        try {
            const newsId = req.params.id;
            const deletedNews = await NewsService.deleteNewsAndUpdateUser(newsId);
            if (!deletedNews) {
                return res.status(404).json({ message: 'News item not found' });
            }
            res.json({ message: 'News item deleted successfully', deletedNews });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new NewsController();
