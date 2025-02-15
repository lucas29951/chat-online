const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    console.log('Nueva conexion...');

    socket.emit('message', 'Bienvenido al Chat Online!');

    socket.broadcast.emit('message', 'Un usuario se unio al chat');

    socket.on('disconnect', () => {
        io.emit('message', 'Un usuario salio del chat');
    });

    socket.on('chatMessage', (msg) => {
        // console.log(msg);
        io.emit('message', msg);
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server ejecutandose en el puerto ${PORT}`));