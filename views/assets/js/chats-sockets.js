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
    messageContent.onchange = () => {
        messageContent = messageContent.value 
    }
}

let sendMessageBtn = document.getElementById('sendMessageBtn')


let chatBox = document.getElementById('chat-inner')

socket.on('connect', () => {
    socket.emit('joinOnMyRoom', myId)  
})

if (sendMessageBtn) {
    sendMessageBtn.onclick = e => {
        e.preventDefault()
        socket.emit('send new message', {
            messageAuthor ,
            chatId ,
            messageContent
        })
    }
}

socket.on('message sent successfully', data => {
    let authorName = data.ourChat.users.find(x => x.id === data.authorId).name
    let authorImage = data.ourChat.users.find(x => x.id === data.authorId).image 
    
    let messageDate = new Date(Date.now())
    let messageMinutes = messageDate.getMinutes()

    if (messageMinutes < 10) {
        messageMinutes = "0" + messageMinutes
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
})

socket.on('receive a new message', data => {
    console.log('i received new message')
    // let authorName = data.ourChat.users.find(x => x.id === data.authorId).name
    // let authorImage = data.ourChat.users.find(x => x.id === data.authorId).image 
    
    // let messageDate = new Date(Date.now())
    // let messageMinutes = messageDate.getMinutes()

    // if (messageMinutes < 10) {
    //     messageMinutes = "0" + messageMinutes
    // }
    
    // chatBox.innerHTML += `
    //     <div class="block-chat receive-c">
    //         <div class="img-client"> <img src="/${authorImage}" /> </div>
    //         <div class="chat-text">
    //             <h5 style="text-align: start;">${ authorName }</h5>
    //             <p style="text-align: start;">${ data.messageContent }</p>
    //             <div class="date-in" style="text-align: end;">
    //                 <span> ${ messageDate.getDate() }/${ Number(messageDate.getMonth()) + 1 }/${ messageDate.getFullYear() }, ${ messageDate.getHours() }:${ messageMinutes } </span>
    //             </div>
    //         </div>
    //     </div>
    // `
})