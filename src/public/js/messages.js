const socket = io();

let user;
const chatBox = document.getElementById('textoEntrada')



Swal.fire({
    icon: "info",
    title: "Introduci tu email",
    input: 'email',
    inputAttributes: {
      autocapitalize: 'off',
      autocorrect: 'off'
    },
    preConfirm: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          Swal.showValidationMessage('Por favor, ingrese un correo electrónico válido');
        }
        return email;
      },
    color: "black",
    inputValidator: (value) => {
        if (!value) {
            return "Debes ingresar un email para continuar"
        } else {

            socket.emit('userConnected',  {user: value} )
        }
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value

    const myEmail = document.getElementById('myEmail')
    myEmail.innerHTML = user
})


chatBox.addEventListener('keyup', evt => {
    if (evt.key === 'Enter') {
        if (chatBox.value.trim().length > 0) {
            socket.emit('message', { user: user, message: chatBox.value })
            chatBox.value = ""
        } else {
            Swal.fire({
                icon: "warning",
                title: "Alert",
                text: "Por favor ingrese un mensaje"
            })
        }
    }

})

socket.on('messageLogs', data => {
    const messagesLogs = document.getElementById('messageLogs')
    let logs = "";
    data.forEach(log => {
        logs += `<b>${log.user}</b> dice: ${log.message}<br/>`
    })
    messagesLogs.innerHTML = logs
})

socket.on('userConnected', data => {
    let message = `Nuevo usuario conectado ${data.user}`
    Swal.fire({
        icon: 'info',
        title: 'Nuevo usuario conectado',
        text: message,
        toast: true,
        color: black
    })
})

const closeChatBox = document.getElementById('closeChat')

closeChatBox.addEventListener('click', evt=>{
    const messagesLogs = document.getElementById('messageLogs')
    alert("Gracias por usar este chat");
    socket.emit('closeChat', {close: "close"});
    messagesLogs.innerHTML = ''
})