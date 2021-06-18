const validationResult = require('express-validator').validationResult
const usersModel = require('../models/users-model')
const bcrypt = require('bcrypt')

exports.getSignup = (req, res, next) => {
    res.render('signup', {
        pageName : 'signup' ,
        validationError : req.flash('validationError') ,
        authenticationError : req.flash('authenticationError') ,
        isAuth : req.session.userId ,
        userName : req.session.userName ,
    })
}

exports.createUser = async (req, res, next) => {

    if (validationResult(req).array().length > 0) {
        req.flash('validationError', validationResult(req).array())
        return res.redirect('/signup')
    }


    if (req.body.password != req.body.cpassword) {
        req.flash('authenticationError', 'Passwords not match !!')
        return res.redirect('/signup')
    }

    const isUser = await usersModel.findOne({email : req.body.email})

    if (isUser) {
        req.flash('authenticationError', 'This email already exists')
        return res.redirect('/signup')
    }

    const hashedPassword = bcrypt.hashSync(req.body.password , 10)

    let profilePic = 'default-pic.jpg'

    if (req.file) {
        profilePic = req.file.filename
    }

    await usersModel.create({
        username : req.body.name ,
        email : req.body.email ,
        password : hashedPassword ,
        image : profilePic
    })

    res.redirect('/login')
}