const router = require('express').Router()
const friendsController = require('../controllers/friends-controller')
const gardController = require('../controllers/gard-controller')

router.get('/friends/id=:id', gardController.isAuth , friendsController.getFriends)
router.get('/friends', gardController.isAuth, friendsController.getMyFriends)

module.exports = router ;