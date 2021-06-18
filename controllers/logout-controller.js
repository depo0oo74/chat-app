const usersModel = require('../models/users-model')

exports.logout = async (req,res,next) => {

    const myId = req.body.userId ;

    // await usersModel.updateOne({_id : myId}, {
    //     status : false
    // })
    
    req.session.destroy(() => {
        res.redirect('/login')
    })
}