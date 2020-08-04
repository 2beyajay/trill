var socket = io();

function sendMessage(){
    socket.emit('chat message', 'coming in from the client side');
}

