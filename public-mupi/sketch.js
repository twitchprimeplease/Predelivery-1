const NGROK = `https://${window.location.hostname}`;
let socket = io(NGROK, { path: '/real-time' });
console.log('Server IP: ', NGROK);

let controllerX, controllerY = 0;
let deviceWidth, deviceHeight = 0;
let mupiWidth, mupiHeight = 0;
let ballSize = 20;
let baseController = 0;
let posY = 0
let velY = 2;

function setup() {
    frameRate(60);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    controllerX = windowWidth / 2;
    controllerY = windowHeight / 2;
    mupiWidth = windowWidth;
    mupiHeight = windowHeight;
    baseController = windowHeight / 2;
    background(0);
}

function draw() {
    background(0, 5);
    newCursor(pmouseX, pmouseY,255);
    fill(255);
    ellipse(controllerX, controllerY, ballSize, ballSize);
    rect(baseController,windowHeight -(windowHeight / 10), 200, 50);
    posY += velY
    if(posY <=windowHeight){
        ellipse(windowWidth / 2,posY, ballSize, ballSize);
    }

}

function mouseDragged() {
    socket.emit('positions', { controlX: pmouseX, controlY: pmouseY });
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function newCursor(x, y,color) {
    noStroke();
    fill(color);
    ellipse(x, y, 10, 10);
}

socket.on('mupi-instructions', instructions => {
    console.log('ID: ' + socket.id);

    let { interactions } = instructions;
    switch (interactions) {
        case 0:
            let { pmouseX } = instructions;
            // controllerX = (pmouseX * mupiWidth) / deviceWidth;
            // controllerY = (pmouseY * mupiHeight) / deviceHeight;
            // console.log({ controllerX, controllerY });
            baseController = (pmouseX * mupiWidth) / deviceWidth
            break;
        case 1:
            let { pAccelerationX, pAccelerationY, pAccelerationZ } = instructions;
            ballSize = pAccelerationY < 0 ? pAccelerationY * -2 : pAccelerationY * 2;
            break;
        case 2:
            let { rotationX, rotationY, rotationZ } = instructions;
            controllerY = (rotationX * mupiHeight) / 90;
            controllerX = (rotationY * mupiWidth) / 90;
            break;
            // case 3:
            //     let { pbaseX } = instructions;
            //     baseController = (pbaseX * mupiWidth) / deviceWidth;
            //     console.log({ pbaseX });
            //     console.log("pasa")
            //     break;
    }


});

socket.on('mupi-size', deviceSize => {
    let { windowWidth, windowHeight } = deviceSize;
    deviceWidth = windowWidth;
    deviceHeight = windowHeight;
    console.log(`User is using a smartphone size of ${deviceWidth} and ${deviceHeight}`);
});