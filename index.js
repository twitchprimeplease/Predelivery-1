const express = require('express');
const { Server } = require('socket.io');
const PORT = 5050; // No cambiar, tienes que ponerlo en ngrok también
const SERVER_IP = '172.30.114.117'; // Cambiar por la IP del computador, tu comando es ifconfig en0

// const os = require('os');
// const IPaddress = os.networkInterfaces().en0[1].address;

const app = express();
app.use(express.json());
app.use('/app', express.static('public-app'));
app.use('/mupi', express.static('public-mupi'));

const httpServer = app.listen(PORT, () => {
    console.log(`http://${SERVER_IP}:${PORT}/app`);
    console.log(`http://${SERVER_IP}:${PORT}/mupi`);
});
// Run on terminal: ngrok http 5050;

const io = new Server(httpServer, { path: '/real-time' });

io.on('connection', socket => {
    console.log(socket.id);

    socket.on('device-size', deviceSize => {
        socket.broadcast.emit('mupi-size', deviceSize);
    });

    socket.on('mobile-instructions', instructions => {
        console.log(instructions);
        socket.broadcast.emit('mupi-instructions', instructions);
    })

    socket.on('mobile-reset', resetInfo => {
        socket.broadcast.emit('mupi-reset', resetInfo);
        console.log(resetInfo , "a");
    })

    socket.on('mobile-screen', message => {
        console.log(message);
    socket.broadcast.emit('mupi-screen', message)
});

socket.on('mupi-endGame', message => {
    socket.broadcast.emit('mobile-endGame', message);
});

socket.on('mobile-userInfo', message => {
    console.log(message);
    socket.broadcast.emit('mupi-userInfo', message)
})

});


