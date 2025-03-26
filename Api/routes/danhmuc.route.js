var express = require('express');
var router = express.Router();
const danhMucController = require("../controllers/danhmuc.controller");

/* Routes for DanhMuc */
router.get('/', danhMucController.getAll);
router.get('/:id', danhMucController.getById);
router.post('/', danhMucController.insert);
router.put('/:id', danhMucController.update);
router.delete('/:id', danhMucController.delete);

module.exports = router;