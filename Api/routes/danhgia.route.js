var express = require('express');
var router = express.Router();
const danhGiaController = require("../controllers/danhgia.controller");

/* Routes for DanhGia (Reviews) */

// Get all reviews for a specific PowerPoint template
router.get('/powerpoint/:mauPowerPointId', danhGiaController.getAllByPowerPointId);

// Get all reviews for a specific user
router.get('/user/:nguoiDungId', danhGiaController.getAllByUserId);

// Get a review by its ID
router.get('/:id', danhGiaController.getById);

// Insert a new review
router.post('/', danhGiaController.insert);

// Update an existing review
router.put('/:id', danhGiaController.update);

// Delete a review by its ID
router.delete('/:id', danhGiaController.delete);

module.exports = router;
