var express = require('express');
var router = express.Router();
const danhGiaController = require("../controllers/danhgia.controller");

router.get('/powerpoint/:mauPowerPointId', danhGiaController.getAllByPowerPointId);
router.get('/user/:nguoiDungId', danhGiaController.getAllByUserId);
router.get('/:id', danhGiaController.getById);
router.post('/', danhGiaController.insert);
router.put('/:id', danhGiaController.update);
router.delete('/:id', danhGiaController.delete);

module.exports = router;
