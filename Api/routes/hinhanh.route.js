var express = require('express');
var router = express.Router();
const hinhAnhController = require("../controllers/hinhanh.controller");

/* Routes for HinhAnh */
router.get('/top-downloads', hinhAnhController.getTopDownloads);
router.get('/', hinhAnhController.getAll);
router.get('/:id', hinhAnhController.getById);
router.post('/', hinhAnhController.insert);
router.put('/:id', hinhAnhController.update);
router.delete('/:id', hinhAnhController.delete);

module.exports = router;