const usersModel = require('./models/users-model')
const chatsModel = require('./models/chats-model')

module.exports = (socketIO , socket) => {


    socket.on('joinOnMyRoom', async data => {
        await usersModel.updateOne({_id : data}, {
            status : true
        })
        socket.join(data)
        socketIO.to(data).emit('online', data)    
        socket.on('disconnect', async () => {
            socket.emit('offline', data)
            await usersModel.updateOne({_id : data}, {
                status : false
            })
        })          
    })
 

    // add friend 
    socket.on('add friend', async data => {
            
        const myAccount = await usersModel.findById(data.myId)
        const friend = await usersModel.findById(data.friendId)

        myAccount.sentRequests.push({
            id : data.friendId,
        })
        await myAccount.save() 

        friend.friendRequests.push({
            id : data.myId,
        })

        friend.notifications.push({
            id : data.myId ,
            name : data.myUsername ,
            image : data.myImage ,
            typeOfNotification : 'friend request'
        })

        await friend.save()

        socket.emit('request sent')
        
        socketIO.to(data.friendId).emit('newFriendRequest', {
            myId : data.myId ,
            myUsername : data.myUsername ,
            myImage : data.myImage ,
            typeOfNotification : 'friend request'
        })

    })


    // cancel request
    socket.on('cancel request', async data => {
        
        const myAccount = await usersModel.findById(data.myId)
        const friend = await usersModel.findById(data.friendId)

        myAccount.sentRequests.splice(myAccount.sentRequests.findIndex(x => x.id === data.friendId), 1)
        await myAccount.save()

        friend.friendRequests.splice(friend.friendRequests.findIndex(x => x.id === data.myId), 1)

        friend.notifications.splice(friend.notifications.findIndex(x => x.id === data.myId), 1)

        await friend.save()

        
        socket.emit('send request canceled')

        socketIO.to(data.friendId).emit('request canceled', {
            myId : data.myId
        })

    })

    // reject request
    socket.on('reject request', async data => {

        const myAccount = await usersModel.findById(data.myId)
        const friend = await usersModel.findById(data.friendId)

        myAccount.friendRequests.splice(myAccount.friendRequests.findIndex(x => x.id === data.friendId), 1)
        myAccount.notifications.splice(myAccount.notifications.findIndex(x => x.id === data.friendId), 1)
        
        await myAccount.save()

        friend.sentRequests.splice(friend.sentRequests.findIndex(x => x.id === data.myId), 1)
        await friend.save()

        socket.emit('request reject')

        socketIO.to(data.friendId).emit('your request reject', {
            myId : data.myId
        })

    })

    // accept request 
    socket.on('accept request', async data => {
        
        const myAccount = await usersModel.findById(data.myId)
        const friend = await usersModel.findById(data.friendId)

        const newChat = await chatsModel.create({
            users : [
                {id : data.myId , name : data.myUsername , image : data.myImage} ,
                {id : data.friendId , name : data.friendUsername , image : data.friendImage}
            ] ,
        })


        myAccount.friendRequests.splice(myAccount.friendRequests.findIndex(x => x.id === data.friendId), 1) ;
        myAccount.notifications.splice(myAccount.notifications.findIndex(x => x.id === data.friendId), 1)
        myAccount.friends.push({
            id : data.friendId,
            name : data.friendUsername ,
            image : data.friendImage ,
            dateOfJoin : data.friendDateOfJoin ,
            chatId : newChat._id
        })
        await myAccount.save()

        friend.sentRequests.splice(friend.sentRequests.findIndex(x => x.id === data.myId), 1)
        friend.friends.push({
            id : data.myId,
            name : data.myUsername ,
            image : data.myImage ,
            dateOfJoin : data.myDateOfJoin ,
            chatId : newChat._id
        })
        friend.notifications.push({
            id : data.myId ,
            name : data.myUsername ,
            image : data.myImage ,
            typeOfNotification : 'accept request'
        })
        await friend.save()

        socket.emit('accept request', newChat._id)

        socketIO.to(data.friendId).emit('your request accepted', {
            myId : data.myId ,
            myUsername : data.myUsername ,
            myImage : data.myImage ,
            typeOfNotification : 'accept request' ,
            chatId : newChat._id
        })
        

    })

    // delete friend
    socket.on('delete friend', async data => {
        const myAccount = await usersModel.findById(data.myId)
        const friend = await usersModel.findById(data.friendId)
        const chatBetween = myAccount.friends.find(x => x.id === data.friendId ).chatId

        myAccount.friends.splice(myAccount.friends.findIndex(x => x.id === data.friendId), 1) ;
        myAccount.notifications.splice(myAccount.notifications.findIndex(x => x.id === data.friendId), 1)
        await myAccount.save()

        friend.friends.splice(friend.friends.findIndex(x => x.id === data.myId), 1) ;
        friend.notifications.splice(friend.notifications.findIndex(x => x.id === data.myId), 1)
        await friend.save()

        await chatsModel.deleteOne({ _id : chatBetween })

        socket.emit('friend deleted')

        socketIO.to(data.friendId).emit('you deleted', {
            myId : data.myId
        })
    })


    // new message 
    socket.on('send new message', async data => {
        const ourChat = await chatsModel.findById(data.chatId)

        const receiverId = ourChat.users.find(x => x.id !== data.messageAuthor).id


        ourChat.messages.push({
            content : data.messageContent ,
            authorId : data.messageAuthor ,
        })
        await ourChat.save()
        
        socket.emit('message sent successfully', {
            ourChat : ourChat ,
            authorId : data.messageAuthor ,
            messageContent : data.messageContent
        })  

        socketIO.to(receiverId).emit('receive a new message', {
            ourChat : ourChat ,
            authorId : data.messageAuthor ,
            messageContent : data.messageContent
        })

    })


}

