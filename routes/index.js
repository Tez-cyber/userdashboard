const express = require('express');
const router = express.Router()

const userController = require('../controller/userController')

router.get('/', userController.getPage)
router.post('/', userController.postLogin)
router.get('/create-account', userController.getRegisterPage)
router.post('/create-account', userController.registerUser)

module.exports = router