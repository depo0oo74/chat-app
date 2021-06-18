const usersModel = require('../models/users-model')

exports.getFriends = async (req, res, next) => {

    const currentId = req.params.id
    const currentUser = await usersModel.findById(currentId) ;
    const friends = currentUser.friends 
    const myAccount = await usersModel.findById(req.session.userId)

    res.render('friends', {
        pageName : 'friends' ,
        isAuth : req.session.userId ,
        userName : req.session.userName ,
        friends : friends ,
        myAccount : myAccount ,
        currentUser : currentUser
    })
}

exports.getMyFriends = (req, res, next) => {
    res.redirect(`/friends/id=${req.session.userId}`)
}