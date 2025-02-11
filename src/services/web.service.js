const WebModel = require('../models/website');  // Đảm bảo tên model trùng khớp
class WebService {
    async createWeb(data) {
        try {
            const createdWeb = await WebModel.create(data);
            return createdWeb;
        } catch (error) {
            throw error;
        }
    }

    async getWebById(webId) {
        try {
            const webItem = await WebModel.findById(webId);
            return webItem;
        } catch (error) {
            throw error;
        }
    }

    async getWeb() {
        try {
            const webList = await WebModel.find();
            return webList;
        } catch (error) {
            throw error;
        }
    }

    async updateWeb(webId, newData) {
        try {
            const updatedWeb = await WebModel.findByIdAndUpdate(webId, newData, { new: true });
            return updatedWeb;
        } catch (error) {
            throw error;
        }
    }

    async deleteWebAndUpdateUser(webId) {
        try {
            const deletedWeb = await WebModel.findByIdAndDelete(webId);
            return deletedWeb;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new WebService();
