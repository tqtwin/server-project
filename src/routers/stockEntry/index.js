const express = require('express');
const StockEntryController = require('../../controllers/stockentrycontroller');

const router = express.Router();

router.post('/', StockEntryController.createStockEntry);
router.get('/', StockEntryController.getStockEntries);
router.get('/:id', StockEntryController.getStockEntryById);
router.put('/:id', StockEntryController.updateStockEntry);
router.delete('/:id', StockEntryController.deleteStockEntry);

module.exports = router;
