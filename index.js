const express = require('express');
const { Server } = require('socket.io'); //esta trayendo el socket, se saca la propiedad server  del objeto que trae socket

const expressApp = express(); //Environment setup

expressApp.use(express.json()) //Middlewares
expressApp.use('/app', express.static('public-mobile')); //Middlewares
expressApp.use('/app', express.static('public-OOH'));

const httpServer = expressApp.listen(5050, () => { //Star the server, guarda lo que nos entrega el evento lisen en una variable
    console.log(`http://localhost:5050/app`);
})

//servers se construye encima del otro server

const io = new Server(httpServer, { path: '/real-time' }); //WebSocket Server (instance) initialization, tambien le estregados una ruta donde puede entrar al server

io.on('connection', (socket) => { //Listening for webSocket connections, esta escuchando las conexiones del servidos, connection es una palabra reservada
    console.log('Conected!',socket.id)
    socket.on('positions', (message) =>{
        console.log(message);
        socket.broadcast.emit('display-positions', message)
    })

});

//una vez cuando se tiene el server se crea el sockets para seguir con la coneción