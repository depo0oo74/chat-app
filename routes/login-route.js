const express = require('express')
const router = require('express').Router()
const loginController = require('../controllers/login-controller')
const gardController = require('../controllers/gard-controller')


router.get('/login', gardController.notAuth , loginController.getLogin)
router.post('/login', express.urlencoded({extended : true}), loginController.postLogin)


module.exports = router