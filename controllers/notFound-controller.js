const usersModel = require('../models/users-model')

exports.notFound = async (req, res, next) => {
    
    const myAccount = await usersModel.findById(req.session.userId)

    res.status(404).render('not-found', {
        pageName : '404' ,
        isAuth : req.session.userId ,
        userName : req.session.userName ,
        myAccount : myAccount
    })
}