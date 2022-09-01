const NGROK = `https://${window.location.hostname}`;
console.log('Server IP: ', NGROK);
let socket = io(NGROK, {
    path: '/real-time'
});

let controllerX, controllerY = 0;
let interactions = 0;
let isTouched = false;
let baseController = 0;
let screenController = 'PlayScreen';
let visualbtn = true;
let startScreen;
let endGame = false;

let eBottomX;
let eBottomY = 50
let eBottomW = 100;
let eBottomH = 50;


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
    eBottomX = windowWidth - 120;
    startScreen = new StartScreen();
    background(0);
    angleMode(DEGREES);

    socket.emit('device-size', {
        windowWidth,
        windowHeight
    });


    let resetButton = createButton("¡Ármalo de nuevo!");
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

            startScreen.show();


            break;
        case 'InstructionsScreen':
            background(255);
            let playButton = createButton("Jugar");
            playButton.mousePressed(() => {
            screenController = 'PlayScreen'
            socket.emit('mobile-screen', {
            screen: 'PlayScreen'
            });
        });
            break;
            case 'PlayScreen':
            fill(0)
            if(endGame === true){
                rect(eBottomX,eBottomY,eBottomW,eBottomH);
            fill(255);
            text('Fin',eBottomX + eBottomW/2,eBottomY + eBottomH/2)
            }
            
            break;
            case 'EndGameScreen':

                break;
            case 'GoodbyeScreen':
                text('Thanks for Playing! Have a good day!', 500,500)
                break;
    }

    
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
    switch (screenController) {
        case 'PlayScreen':
            if(endGame === true) {
                if(pmouseX > eBottomX &&pmouseY > eBottomY && pmouseX < eBottomX + eBottomW && pmouseY < eBottomY + eBottomH){
                
            screenController = 'EndGameScreen'
            socket.emit('mobile-screen', {
            screen: 'EndGameScreen'});
                }
            }

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

socket.on('mobile-endGame', message => {
    let { endGameInfo } = message;
    endGame = endGameInfo;
})