const express = require('express');
const WebController = require('../../controllers/websitecontroller');

const router = express.Router();

router.post('/', WebController.createWeb);
router.get('/', WebController.getAllWeb);
router.get('/:id', WebController.getWebById);
router.put('/:id', WebController.updateWeb);
router.delete('/:id', WebController.deleteWeb);

module.exports = router;
