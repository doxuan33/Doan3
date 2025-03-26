var express = require('express');
var router = express.Router();
const mauPowerpointController = require("../controllers/maupowerpoint.controller");

/* Routes for MauPowerpoint */
router.get('/top-downloads', mauPowerpointController.getTopDownloads);
router.get('/', mauPowerpointController.getAll);
router.get('/:id', mauPowerpointController.getById);
router.post('/', mauPowerpointController.insert);
router.put('/:id', mauPowerpointController.update);
router.delete('/:id', mauPowerpointController.delete);

module.exports = router;