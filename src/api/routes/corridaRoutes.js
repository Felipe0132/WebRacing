const express = require('express');
const router = express.Router();
const corridaController = require('../controller/corridaController');

router.post('/', corridaController.create)
router.get('/', corridaController.buscar)
router.put('/:id', corridaController.update)
router.delete('/:id', corridaController.remove)

module.exports = router;