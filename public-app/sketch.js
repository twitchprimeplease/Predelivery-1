const NGROK = `https://${window.location.hostname}`;
console.log('Server IP: ', NGROK);
let socket = io(NGROK, {
    path: '/real-time'
});

let controllerX, controllerY = 0;
let interactions = 0;
let isTouched = false;
let baseController = 0;
let screenController = 'StartScreen';
let visualbtn = true;
let instructionsScreen;

function setup() {
    frameRate(60);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    controllerX = windowWidth / 2;
    controllerY = windowHeight / 2;
    baseController = windowHeight / 2;
    instructionsScreen = new InstructionsScreen();
    background(0);
    angleMode(DEGREES);

    socket.emit('device-size', {
        windowWidth,
        windowHeight
    });


    let resetButton = createButton("Restart your lego!");
    resetButton.mousePressed(() => {

        socket.emit('mobile-reset', {
            resetInfo: true
        });
        background(255);
    });

}

function draw() {
    newCursor(pmouseX, pmouseY);
    fill(255);

    switch (screenController) {
        case 'StartScreen':
            background(0);

            instructionsScreen.show();


            break;
        case 'InstructionsScreen':
            background(255);
        fill(255);
            rect(0, 0, 1000,1000)
            // let btn = createButton("btn");

            break;
    }

    //ellipse(controllerX, controllerY, 50, 50);
}



function pantallaScreen(){
    

}

function touchMoved() {
    switch (interactions) {
        case 0:
            socket.emit('mobile-instructions', {
                interactions,
                pmouseX,
                pmouseY
            });
            background(255, 0, 0);
            break;
    }


}

function touchStarted() {
    isTouched = true;
}

function touchEnded() {
    isTouched = false;
}

function deviceMoved() {
    switch (interactions) {
        case 1:
            socket.emit('mobile-instructions', {
                interactions,
                pAccelerationX,
                pAccelerationY,
                pAccelerationZ
            });
            background(0, 255, 255);
            break;
        case 2:
            socket.emit('mobile-instructions', {
                interactions,
                rotationX,
                rotationY,
                rotationZ
            });
            background(0, 255, 0);
            break;
    }

}

function deviceShaken() {
    //socket.emit('mobile-instructions', 'Moved!');
    //background(0, 255, 255);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function newCursor(x, y) {
    noStroke();
    fill(255);
    ellipse(x, y, 10, 10);
}