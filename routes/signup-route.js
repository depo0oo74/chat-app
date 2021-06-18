const express = require('express')
const router = require('express').Router()
const signupController = require('../controllers/signup-controller')
const check = require('express-validator').check
const gardController = require('../controllers/gard-controller')
const multer = require('multer')
router.get('/signup', gardController.notAuth , signupController.getSignup)

router.post(
    '/signup', 
    multer({
        storage : multer.diskStorage({
            destination : (req, file, cb) => {
                cb(null, 'uploads')
            },
            filename : (req, file, cb) => {
                cb(null, Date.now() + '_' + file.originalname)
            }
        })
    }).single('image'),
    check('name').not().isEmpty().withMessage('Name field is required') ,
    check('email').not().isEmpty().withMessage('Email field is required').isEmail().withMessage('Invalid format') ,
    signupController.createUser
)

module.exports = router