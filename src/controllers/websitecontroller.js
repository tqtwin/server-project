const WebService = require('../services/web.service');

class WebController {
    async createWeb(req, res) {
        try {
            const data = req.body;
            const webItem = await WebService.createWeb(data);
            res.status(201).json(webItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getWebById(req, res) {
        try {
            const webId = req.params.id;
            const webItem = await WebService.getWebById(webId);
            if (!webItem) {
                return res.status(404).json({ message: 'Web item not found' });
            }
            res.json(webItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllWeb(req, res) {
        try {
            const webList = await WebService.getWeb();
            res.json(webList);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateWeb(req, res) {
        try {
            const webId = req.params.id;
            const newData = req.body;
            const updatedWeb = await WebService.updateWeb(webId, newData);
            if (!updatedWeb) {
                return res.status(404).json({ message: 'Web item not found' });
            }
            res.json(updatedWeb);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteWeb(req, res) {
        try {
            const webId = req.params.id;
            const deletedWeb = await WebService.deleteWebAndUpdateUser(webId);
            if (!deletedWeb) {
                return res.status(404).json({ message: 'Web item not found' });
            }
            res.json({ message: 'Web item deleted successfully', deletedWeb });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new WebController();
