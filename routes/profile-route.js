const express = require('express')
const router = require('express').Router();
const profileController = require('../controllers/profile-controller')
const gardController = require('../controllers/gard-controller')
const multer = require('multer')

router.get('/profile/id=:id', gardController.isAuth , profileController.getProfile)
router.get('/profile', gardController.isAuth , profileController.getMyProfile)
router.get('/', gardController.isAuth , profileController.getMyProfile)

router.post(
    '/profile/changePic',
    multer({
        storage : multer.diskStorage({
            destination : (req, file, cb) => {
                cb(null, 'uploads')
            } , 
            filename : (req, file, cb) => {
                cb(null, Date.now() + '_' + file.originalname)
            }
        })
    }).single('newPhoto') ,
    profileController.changePhoto
)

// router.post('/profile/add', express.urlencoded({extended : true}), profileController.addFriend)
// router.post('/profile/cancelRequest', express.urlencoded({extended : true}), profileController.cancelRequest)
// router.post('/profile/acceptRequest', express.urlencoded({extended : true}), profileController.acceptRequest)
// router.post('/profile/rejectRequest', express.urlencoded({extended : true}), profileController.rejectRequest)
// router.post('/profile/deleteFriend', express.urlencoded({extended : true}), profileController.deleteFriend)

module.exports = router