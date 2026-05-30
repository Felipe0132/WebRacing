const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')

router.get('/', userController.buscar)
router.put('/', userController.update)
router.delete('/', userController.remove)

module.exports = router