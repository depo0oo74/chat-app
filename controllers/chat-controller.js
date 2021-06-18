const usersModel = require('../models/users-model')
const chatsModel = require('../models/chats-model')

exports.getChat = async (req, res, next) => {

    const myAccount = await usersModel.findById(req.session.userId)
    const chatId = req.params.id
    const ourChat = await chatsModel.findById(chatId)

    res.render('chat', {
        pageName : 'chat' ,
        isAuth : req.session.userId ,
        userName : req.session.userName ,
        myAccount : myAccount ,
        chatId : chatId ,
        ourChat : ourChat
    })
}

