const bcrypt = require('bcrypt')
const usersModel = require('../models/users-model')


exports.getLogin = (req, res, next) => {
    
    res.render('login', {
        pageName : 'login' ,
        authenticationError : req.flash('authenticationError') ,
        isAuth : req.session.userId ,
        userName : req.session.userName ,
        
    })
}

exports.postLogin = async (req, res, next) => {

    const isUser = await usersModel.findOne({email : req.body.email})

    if (!isUser) {
        req.flash('authenticationError', 'This email not exist')
        return res.redirect('/login')
    }

    const checkPassword = await bcrypt.compare(req.body.password, isUser.password)

    if (checkPassword === false) {
        req.flash('authenticationError', 'Password is not correct')
        return res.redirect('/login')
    }  


    // await usersModel.updateOne({email : req.body.email}, {
    //     status : true
    // })

    req.session.userId = isUser.id ;
    req.session.userName = isUser.username 
    res.redirect('/profile')
}