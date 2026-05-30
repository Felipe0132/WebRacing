const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')

router.get('/google', authController.googleLogin)
router.get('/google/callback', authController.googleCallback)
router.get('/logout', authController.logout)

module.exports = router