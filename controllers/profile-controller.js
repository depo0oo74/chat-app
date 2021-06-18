const usersModel = require('../models/users-model')

exports.getProfile = async (req, res, next) => {

    const currentId = req.params.id
    const currentUser = await usersModel.findById(currentId)
    const myAccount = await usersModel.findById(req.session.userId)

    res.render('profile', {
        pageName : 'profile' ,
        isAuth : req.session.userId ,
        userName : req.session.userName ,
        currentUser : currentUser ,
        myAccount : myAccount ,
        isMyProfile : currentId === req.session.userId ,
        isFriends : myAccount.friends.find(x => x.id === currentUser.id) ,
        isFriendRequest : myAccount.friendRequests.find(x => x.id === currentUser.id) ,
        isRequestSent : myAccount.sentRequests.find(x => x.id === currentUser.id) ,
    })
} 

exports.getMyProfile = (req, res, next) => {
    res.redirect(`/profile/id=${req.session.userId}`)
}


exports.changePhoto = async (req, res, next) => {
    await usersModel.updateOne({_id : req.session.userId}, {
        image : req.file.filename
    })
    res.redirect(`/profile/id=${req.session.userId}`)
}

// exports.addFriend = async (req, res, next) => {
    
//     const myAccount = await usersModel.findById(req.body.myId)
//     const friend = await usersModel.findById(req.body.friendId)

//     myAccount.sentRequests.push({
//         id : req.body.friendId,
//     })
//     await myAccount.save(() => {})

//     friend.friendRequests.push({
//         id : req.body.myId,
//     })
//     await friend.save(() => {})

//     res.redirect(`/profile/id=${req.body.friendId}`)
// }

// exports.cancelRequest = async (req, res, next) => {
//     const myAccount = await usersModel.findById(req.body.myId)
//     const friend = await usersModel.findById(req.body.friendId)

//     myAccount.sentRequests.splice(myAccount.sentRequests.findIndex(x => x.id === req.body.friendId), 1)
//     await myAccount.save(() => {})

//     friend.friendRequests.splice(friend.friendRequests.findIndex(x => x.id === req.body.myId), 1)
//     await friend.save(() => {})

//     res.redirect(`/profile/id=${req.body.friendId}`)
// }

// exports.acceptRequest = async (req, res, next) => {
//     const myAccount = await usersModel.findById(req.body.myId)
//     const friend = await usersModel.findById(req.body.friendId)


//     myAccount.friendRequests.splice(myAccount.friendRequests.findIndex(x => x.id === req.body.friendId), 1) ;
//     myAccount.friends.push({
//         id : req.body.friendId,
//         name : req.body.friendUsername ,
//         image : req.body.friendImage ,
//         dateOfJoin : req.body.friendDateOfJoin
//     })
//     await myAccount.save(() => {})

//     friend.sentRequests.splice(friend.sentRequests.findIndex(x => x.id === req.body.myId), 1)
//     friend.friends.push({
//         id : req.body.myId,
//         name : req.body.myUsername ,
//         image : req.body.myImage ,
//         dateOfJoin : req.body.myDateOfJoin
//     })
//     await friend.save(() => {})

//     res.redirect(`/profile/id=${req.body.friendId}`)
// }

// exports.rejectRequest = async (req, res, next) => {
//     const myAccount = await usersModel.findById(req.body.myId)
//     const friend = await usersModel.findById(req.body.friendId)

//     myAccount.friendRequests.splice(myAccount.friendRequests.findIndex(x => x.id === req.body.friendId), 1)
//     await myAccount.save(() => {})

//     friend.sentRequests.splice(friend.sentRequests.findIndex(x => x.id === req.body.myId), 1)
//     await friend.save(() => {})

//     res.redirect(`/profile/id=${req.body.friendId}`)
// }

// exports.deleteFriend = async (req, res, next) => {
//     const myAccount = await usersModel.findById(req.body.myId)
//     const friend = await usersModel.findById(req.body.friendId)

//     myAccount.friends.splice(myAccount.friends.findIndex(x => x.id === req.body.friendId), 1) ;
//     await myAccount.save(() => {})

//     friend.friends.splice(friend.friends.findIndex(x => x.id === req.body.myId), 1) ;
//     await friend.save(() => {})

//     res.redirect(`/profile/id=${req.body.friendId}`)
// }