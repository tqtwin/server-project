const StockEntryService = require('../services/stockEntry.service');

class StockEntryController {
    async createStockEntry(req, res) {
        try {
            const stockEntry = await StockEntryService.createStockEntry(req.body);
            return res.status(201).json({ message: 'Stock entry created successfully', success: true, data: stockEntry });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating stock entry', success: false, error: error.message });
        }
    }
    async getStockEntries(req, res) {
        try {
            const { stockEntries, total, page, limit } = await StockEntryService.getStockEntries(req.query);
            return res.status(200).json({ success: true, data: stockEntries, total, page, limit });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching stock entries', success: false, error: error.message });
        }
    }

    async getStockEntryById(req, res) {
        try {
            const stockEntry = await StockEntryService.getStockEntryById(req.params.id);
            if (!stockEntry) {
                return res.status(404).json({ message: 'Stock entry not found', success: false });
            }
            return res.status(200).json({ success: true, data: stockEntry });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching stock entry', success: false, error: error.message });
        }
    }

    async updateStockEntry(req, res) {
        try {
            const stockEntry = await StockEntryService.updateStockEntry(req.params.id, req.body);
            if (!stockEntry) {
                return res.status(404).json({ message: 'Stock entry not found', success: false });
            }
            return res.status(200).json({ message: 'Stock entry updated successfully', success: true, data: stockEntry });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating stock entry', success: false, error: error.message });
        }
    }

    async deleteStockEntry(req, res) {
        try {
            const stockEntryId = req.params.id;
            const stockEntry = await StockEntryService.getStockEntryById(stockEntryId);
            if (!stockEntry) {
                return res.status(404).json({ message: 'Stock entry not found', success: false });
            }
            await StockEntryService.deleteStockEntry(stockEntryId);
            return res.status(200).json({ message: 'Stock entry deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting stock entry', success: false, error: error.message });
        }
    }
}

module.exports = new StockEntryController();
