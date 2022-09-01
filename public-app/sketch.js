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
let startScreen;
let instructionsScreen;
let playScreen;
let enGameScreen;
let goodbyeScreen;
let endGame = false;

let eBottomX;
let eBottomY = 50
let eBottomW = 100;
let eBottomH = 50;



function preload() {

}


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

    background(0);
    angleMode(DEGREES);

    socket.emit('device-size', {
        windowWidth,
        windowHeight
    });

}

function draw() {
    newCursor(pmouseX, pmouseY);
    fill(255);
    startScreen = new StartScreen(windowWidth,windowHeight);
    instructionsScreen = new InstructionsScreen(windowWidth, windowHeight);
    playScreen = new PlayScreen(windowWidth, windowHeight);
    endGameScreen = new EndGameScreen(windowWidth, windowHeight);
    goodbyeScreen = new GoodbyeScreen(windowWidth, windowHeight);

    switch (screenController) {
        case 'StartScreen':
            startScreen.show();
            break;
        case 'InstructionsScreen':
            instructionsScreen.show();
            break;
            case 'PlayScreen':
            playScreen.show();
            fill(0)
            if(endGame != false){
                rect(eBottomX,eBottomY,eBottomW,eBottomH);
                fill(255);
                textAlign(CENTER,CENTER);
                text('Fin',eBottomX + eBottomW/2,eBottomY + eBottomH/2)
            }
            
            break;
            case 'EndGameScreen':

                break;
            case 'GoodbyeScreen':
                

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
            break;
    }
    
}

function mousePressed(){
    switch (screenController) {
        case 'StartScreen':

            startScreen.touched();

            break;
            case 'InstructionsScreen':
                instructionsScreen.touched();
            
                break;
        case 'PlayScreen':
            if (pmouseX > playScreen.getxB() &&pmouseY > playScreen.getyB() && pmouseX < playScreen.getxB() + playScreen.getwB() && pmouseY < playScreen.getyB() + playScreen.gethB()){
                socket.emit('mobile-reset', {resetInfo: true});
                endGame = false;
            }

            if(endGame === true) {
                if(pmouseX > eBottomX &&pmouseY > eBottomY && pmouseX < eBottomX + eBottomW && pmouseY < eBottomY + eBottomH){
                
                screenController = 'EndGameScreen'
                socket.emit('mobile-screen', {
                screen: 'EndGameScreen'});
                }
            }
            break;   
    }
    console.log(screenController);
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