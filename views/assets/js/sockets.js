/* client side sockets */


// socket init
const socket = io()


let myId = document.getElementById('myId') ;
if (myId != null) {
    myId = myId.value
}
let myUsername = document.getElementById('myUsername') ;
if (myUsername != null) {
    myUsername = myUsername.value
}
let myImage = document.getElementById('myImage') ;
if (myImage != null) {
    myImage = myImage.value
}
let myDateOfJoin = document.getElementById('myDateOfJoin') ;
if (myDateOfJoin != null) {
    myDateOfJoin = myDateOfJoin.value
}
let friendId = document.getElementById('friendId') ;
if (friendId != null) {
    friendId = friendId.value
}
let friendUsername = document.getElementById('friendUsername') ;
if (friendUsername != null) {
    friendUsername = friendUsername.value
}
let friendImage = document.getElementById('friendImage') ;
if (friendImage != null) {
    friendImage = friendImage.value
}
let friendDateOfJoin = document.getElementById('friendDateOfJoin') ;
if (friendDateOfJoin != null) {
    friendDateOfJoin = friendDateOfJoin.value
}
let chatId = document.getElementById('chatId')
if (chatId != null) {
    chatId = chatId.value
}
let messageAuthor = document.getElementById('author')
if (messageAuthor != null) {
    messageAuthor = messageAuthor.value
}

let messageContent = document.getElementById('messageContent')
if (messageContent != null) {
    messageContent.onchange = e => {
        messageContent = e.target.value 
    }
}








// buttons

let addBtn = document.getElementById('addBtn') ;
let cancelBtn = document.getElementById('cancelBtn')
let rejectBtn = document.getElementById('rejectBtn')
let acceptBtn = document.getElementById('acceptBtn')
let deleteBtn = document.getElementById('deleteBtn')
let chatBtn = document.getElementById('chatBtn')
let friendNum = document.getElementById('friendNum')
let sendMessageBtn = document.getElementById('sendMessageBtn')


// notification 

let dropdownMenu = document.getElementById('dropdown-menu')
let notificationButton = document.getElementById('notificationMenu')

// chat box

let chatBox = document.getElementById('chat-inner')



socket.emit('joinOnMyRoom', myId)  

socket.on('online', data => {
    let status = document.getElementById(`status_${data}`)
    if (status) {
        status.classList.remove('offline')
        status.classList.add('online')
    }
})

socket.on('offline', data => {
    let status = document.getElementById(`status_${data}`)
    if (status) {
        status.classList.remove('online')
        status.classList.add('offline')
    }
})




if (addBtn) {
    addBtn.onclick = e => {
        e.preventDefault()
        socket.emit('add friend', {
            myId : myId ,
            friendId : friendId ,
            myUsername : myUsername ,
            myImage : myImage ,
        })
    }
}

if (cancelBtn) {
    cancelBtn.onclick = e => {
        e.preventDefault()
        socket.emit('cancel request', {
            myId : myId ,
            friendId : friendId ,
        })
    }
}


if (rejectBtn) {
    rejectBtn.onclick = e => {
        e.preventDefault();
        socket.emit('reject request', {
            myId : myId ,
            friendId : friendId ,
        })
    }
}

if (acceptBtn) {
    acceptBtn.onclick = e => {
        e.preventDefault()
        socket.emit('accept request', {
            myId : myId ,
            myUsername : myUsername ,
            myImage : myImage ,
            myDateOfJoin : myDateOfJoin ,
            friendId : friendId ,
            friendUsername : friendUsername ,
            friendImage : friendImage ,
            friendDateOfJoin : friendDateOfJoin
        })
    }
}

if (deleteBtn) {
    deleteBtn.onclick = e => {
        e.preventDefault() ;
        socket.emit('delete friend', {
            myId : myId ,
            friendId : friendId ,
        })
    }
}

if (sendMessageBtn) {
    sendMessageBtn.onclick = e => {
        e.preventDefault()
        if (messageContent) {
            socket.emit('send new message', {
                messageAuthor ,
                chatId ,
                messageContent
            })
        }
    }
}

socket.on('message sent successfully', data => {
    let authorName = data.ourChat.users.find(x => x.id === data.authorId).name
    let authorImage = data.ourChat.users.find(x => x.id === data.authorId).image 
    
    let messageDate = new Date(Date.now())
    let messageMinutes = messageDate.getMinutes()

    document.getElementById('messageContent').value = ''

    if (messageMinutes < 10) {
        messageMinutes = "0" + messageMinutes
    }
    if (chatBox.querySelector('.lets-talk')) {
        chatBox.querySelector('.lets-talk').style.display = 'none'
    } 
    
    chatBox.innerHTML += `
        <div class="block-chat sent-c">
            <div class="img-client"> <img src="/${authorImage}" /> </div>
            <div class="chat-text">
                <h5 style="text-align: start;">${ authorName }</h5>
                <p style="text-align: start;">${ data.messageContent }</p>
                <div class="date-in" style="text-align: end;">
                    <span> ${ messageDate.getDate() }/${ Number(messageDate.getMonth()) + 1 }/${ messageDate.getFullYear() }, ${ messageDate.getHours() }:${ messageMinutes } </span>
                </div>
            </div>
        </div>
    `
    chatBox.scrollTop = chatBox.scrollHeight
})

socket.on('receive a new message', data => {
    let authorName = data.ourChat.users.find(x => x.id === data.authorId).name
    let authorImage = data.ourChat.users.find(x => x.id === data.authorId).image 
    
    let messageDate = new Date(Date.now())
    let messageMinutes = messageDate.getMinutes()

    if (messageMinutes < 10) {
        messageMinutes = "0" + messageMinutes
    }

    if (chatBox.querySelector('.lets-talk')) {
        chatBox.querySelector('.lets-talk').style.display = 'none'
    }

    
    chatBox.innerHTML += `
        <div class="block-chat receive-c">
            <div class="img-client"> <img src="/${authorImage}" /> </div>
            <div class="chat-text">
                <h5 style="text-align: start;">${ authorName }</h5>
                <p style="text-align: start;">${ data.messageContent }</p>
                <div class="date-in" style="text-align: end;">
                    <span> ${ messageDate.getDate() }/${ Number(messageDate.getMonth()) + 1 }/${ messageDate.getFullYear() }, ${ messageDate.getHours() }:${ messageMinutes } </span>
                </div>
            </div>
        </div>
    `
    chatBox.scrollTop = chatBox.scrollHeight
})





socket.on('request sent', () => {
    addBtn.setAttribute("type", "hidden")
    cancelBtn.setAttribute("type", "submit")
})

socket.on('newFriendRequest', data => {
    if ( window.location.pathname === `/profile/id=${data.myId}`) {
        addBtn.setAttribute('type', 'hidden')
        acceptBtn.setAttribute('type', 'submit')
        rejectBtn.setAttribute('type', 'submit')
    }
    dropdownMenu.querySelector('.note-message').style.display = 'none' 
    notificationButton.querySelector('.red-mark').style.background = 'red'
    notificationButton.onclick = () => {
        notificationButton.querySelector('.red-mark').style.background = 'none'
    } 
    dropdownMenu.innerHTML += `
        <a class="dropdown-item" href="/profile/id=${data.myId}">
            <img src="/${data.myImage}" alt="">
            ${data.myUsername} send you a friend request
        </a>
    `
})

socket.on('send request canceled', () => {
    cancelBtn.setAttribute('type', 'hidden')
    addBtn.setAttribute('type', 'submit')
})

socket.on('request canceled', data => {
    if ( window.location.pathname === `/profile/id=${data.myId}`) {
        acceptBtn.setAttribute('type', 'hidden')
        rejectBtn.setAttribute('type', 'hidden')
        addBtn.setAttribute('type', 'submit')
    }
})

socket.on('request reject', () => {
    acceptBtn.setAttribute('type', 'hidden')
    rejectBtn.setAttribute('type', 'hidden')
    addBtn.setAttribute('type', 'submit')
})

socket.on('your request reject', data => {
    if ( window.location.pathname === `/profile/id=${data.myId}`) {
        cancelBtn.setAttribute('type', 'hidden')
        addBtn.setAttribute('type', 'submit')
    }
})


socket.on('accept request', data => {
    acceptBtn.setAttribute('type', 'hidden')
    rejectBtn.setAttribute('type', 'hidden')
    deleteBtn.setAttribute('type', 'submit')
    chatBtn.classList.remove('hidden')
    chatBtn.classList.add('show')
    chatBtn.setAttribute('href', `/chat/id=${data}`)
    friendNum.innerText = Number(friendNum.innerText) + 1
})

socket.on('your request accepted', data => {
    if ( window.location.pathname === `/profile/id=${data.myId}`) {
        cancelBtn.setAttribute('type', 'hidden')
        chatBtn.classList.add('show')
        chatBtn.classList.remove('hidden')
        chatBtn.setAttribute('href', `/chat/id=${data.chatId}`)
        deleteBtn.setAttribute('type', 'submit')
        friendNum.innerText = Number(friendNum.innerText) + 1
    }
    dropdownMenu.querySelector('.note-message').style.display = 'none' 
    notificationButton.querySelector('.red-mark').style.background = 'red'
    notificationButton.onclick = () => {
        notificationButton.querySelector('.red-mark').style.background = 'none'
    } 
    dropdownMenu.innerHTML += `
        <a class="dropdown-item" href="/profile/id=${data.myId}">
            <img src="/${data.myImage}" alt="">
            ${data.myUsername} accepted your friend request
        </a>
    `
})

socket.on('friend deleted', () => {
    deleteBtn.setAttribute('type', 'hidden')
    chatBtn.classList.add('hidden')
    chatBtn.classList.remove('show')
    addBtn.setAttribute('type', 'submit')
    friendNum.innerText = Number(friendNum.innerText) - 1
})

socket.on('you deleted', data => {
    if ( window.location.pathname === `/profile/id=${data.myId}`) {
        deleteBtn.setAttribute('type', 'hidden')
        chatBtn.classList.add('hidden')
        chatBtn.classList.remove('show')
        addBtn.setAttribute('type', 'submit')
        friendNum.innerText = Number(friendNum.innerText) - 1
    }
})