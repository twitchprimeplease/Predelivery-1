const express = require('express');
const cors = require("cors");
const { FireStoreDB } = require("./firebase-config.js");
const { Server } = require('socket.io');
const { SerialPort, ReadlineParser } = require('serialport');
const PORT = 5050; // No cambiar, tienes que ponerlo en ngrok también
const SERVER_IP = '172.30.114.117'; // Cambiar por la IP del computador, tu comando es ifconfig en0

// const os = require('os');
// const IPaddress = os.networkInterfaces().en0[1].address;

const leadsCollection = new FireStoreDB('Leads')
const installationCollection = new FireStoreDB('Installation')

const app = express();
app.use(cors({ origin: "*" }))
app.use(express.json());
app.use('/app', express.static('public-app'));
app.use('/mupi', express.static('public-mupi'));

const httpServer = app.listen(PORT, () => {
    console.log(`http://${SERVER_IP}:${PORT}/app`);
    console.log(`http://${SERVER_IP}:${PORT}/mupi`);
});

app.get('/leads', (request, response) => {
    timeStamp();
    leadsCollection.getCollection()
        .then((leads) => {
            console.log(leads);
            response.send(leads);
        })
})

app.get('/installations', (request, response) => {
    timeStamp();
    installationCollection.getCollection()
        .then((installations) => {
            console.log(installations); 
            response.send(installations);
        })
})

app.post('/add-new-lead', (request, response) => {
    timeStamp();
    console.log(request.body);
    request.body.timeStamp = timeStamp();
    leadsCollection.addNewDocument(request.body);
    response.status(200).end();
})

app.post('/add-new-game', (request, response) => {
    timeStamp();
    console.log(request.body);
    request.body.timeStamp = timeStamp();
    installationCollection.addNewDocument(request.body);
    response.status(200).end();
})


function timeStamp() {
    let date = new Date();
    let [month, day, year] = [date.getMonth() + 1, date.getDate(), date.getFullYear()];
    let [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];
    console.log(`${hour}:${minutes}:${seconds} - ${month}/${day}/${year}`);
    return `${hour}:${minutes}:${seconds} - ${month}/${day}/${year}`
}

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
        console.log(resetInfo);
    })

    socket.on('mobile-screen', message => {
        console.log(message);
    socket.broadcast.emit('mupi-screen', message);
});

socket.on('mupi-endGame', message => {
    socket.broadcast.emit('mobile-endGame', message);
});

socket.on('mobile-userInfo', message => {
    console.log(message);
    socket.broadcast.emit('mupi-userInfo', message);
});

socket.broadcast.emit('arduino', arduinioMessage);

});

const protocolConfiguration = {
    path: '/dev/cu.usbmodem12201',
    baudRate: 9600
}

const port = new SerialPort(protocolConfiguration);
const parser = port.pipe(new ReadlineParser());

let arduinioMessage = {
    botonA: false,
    botonB: false,
    distance: 0,

}

parser.on('data', (data) => {


    let dataArray = data.split(' ');
    arduinioMessage.botonA = dataArray[0];
    arduinioMessage.botonB = dataArray[1];
    arduinioMessage.distance = parseInt(dataArray[2]);
    console.log(arduinioMessage);
    io.emit('arduino', arduinioMessage);

});


