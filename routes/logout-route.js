const router = require('express').Router()
const logoutController = require('../controllers/logout-controller')
const gardController = require('../controllers/gard-controller')
const express = require('express')

router.all('/logout', gardController.isAuth , express.urlencoded({extended : true}) , logoutController.logout)

module.exports = router