var express = require('express');
var router = express.Router();
const lichSuTaiXuongController = require("../controllers/lichsutaixuong.controller");

/* Routes for LichSuTaiXuong */
router.get('/', lichSuTaiXuongController.getAll);
router.get('/:id', lichSuTaiXuongController.getById);
router.post('/', lichSuTaiXuongController.insert);
router.put('/:id', lichSuTaiXuongController.update);
router.delete('/:id', lichSuTaiXuongController.delete);

module.exports = router;