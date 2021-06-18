const express = require('express')
const router = require('express').Router()
const chatController = require('../controllers/chat-controller')
const gardController = require('../controllers/gard-controller')

router.get('/chat/id=:id', gardController.isAuth , chatController.getChat)

module.exports = router