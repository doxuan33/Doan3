var express = require('express');
var router = express.Router();
const nguoiDungController = require("../controllers/nguoidung.controller");

/* Routes for NguoiDung */
router.get('/', nguoiDungController.getAll);
router.get('/:id', nguoiDungController.getById);
router.post('/', nguoiDungController.insert);
router.put('/:id', nguoiDungController.update);
router.delete('/:id', nguoiDungController.delete);

module.exports = router;