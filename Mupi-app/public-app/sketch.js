const NGROK = `https://${window.location.hostname}`;
//console.log('Server IP: ', NGROK);
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
let endGameScreen;
let goodbyeScreen;
let warningScreen;
let endGame = false;

let eBottomX;
let eBottomY = 50
let eBottomW = 100;
let eBottomH = 50;

let userName;
let userEmail;
let userInput;
let emailInput;

let sendBottom;

let startScreenImg;
let instructionsScreenImg;
let playScreenImg;
let endGameScreenImg;
let warningScreenImg;
let goodScreenImg;

function preload() {
    startScreenImg = loadImage('./Images/StartScreen_App.png');
    instructionsScreenImg = loadImage('./Images/InstrucctionsScreen_App.png');
    playScreenImg = loadImage('./Images/PlayScreen_App.png');
    endGameScreenImg = loadImage('./Images/EndGameScreen_App.png');
    warningScreenImg = loadImage('./Images/WarningScreen_App.png')
    goodScreenImg = loadImage('./Images/GoodbyeScreen_App.png')
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
    
    userInput = createInput('');
    userInput.position((windowWidth / 2) - 100, windowHeight - 300);
    userInput.size(200,40);
    userInput.input(userInputFuntion);
    userInput.style('display', 'none');
    
    emailInput = createInput('');
    emailInput.position((windowWidth / 2) - 100, windowHeight - 230);
    emailInput.size(200,40);
    emailInput.input(emailInputFuntion);
    emailInput.style('display', 'none');

    sendBottom =createButton('Enviar');
    sendBottom.size(windowWidth/3,windowHeight/15)
    sendBottom.position((windowWidth / 3),windowHeight - windowHeight/5);
    sendBottom.mousePressed(sendUserInfo);
    sendBottom.style('display', 'none');
}

function draw() {
    newCursor(pmouseX, pmouseY);
    fill(255);
    startScreen = new StartScreen(windowWidth,windowHeight);
    instructionsScreen = new InstructionsScreen(windowWidth, windowHeight);
    playScreen = new PlayScreen(windowWidth, windowHeight);
    endGameScreen = new EndGameScreen(windowWidth, windowHeight);
    goodbyeScreen = new GoodbyeScreen(windowWidth, windowHeight);
    warningScreen = new WarningScreen(windowWidth, windowHeight);
    imageMode(CENTER)
    switch (screenController) {
        case 'StartScreen':
            background(0);
            image(startScreenImg,windowWidth/2, windowHeight/2,windowWidth,windowWidth*(16/9))
            startScreen.show();
            
            break;
        case 'InstructionsScreen':
            background(0);
            image(instructionsScreenImg,windowWidth/2, windowHeight/2,windowWidth,windowWidth*(16/9));
            instructionsScreen.show();
            
            break;
            case 'PlayScreen':
            background(0)
            image(playScreenImg,windowWidth/2, windowHeight/2,windowWidth,windowWidth*(16/9));
            playScreen.show();
            
            fill(0);
            if(endGame != false){
                rect(eBottomX,eBottomY,eBottomW,eBottomH,eBottomY/2);
                fill(255);
                textAlign(CENTER,CENTER);
                text('Terminar',eBottomX + eBottomW/2,eBottomY + eBottomH/2)
            }
            
            break;
            case 'EndGameScreen':
                image(endGameScreenImg,windowWidth/2, windowHeight/2,windowWidth,windowWidth*(16/9));
                userInput.style('display', 'block');
                emailInput.style('display', 'block');
                sendBottom.style('display', 'block');
                endGameScreen.show();
                textSize(windowWidth/25)
                fill(87, 110, 228);
                text('Nombre',(windowWidth / 2) - 100, windowHeight - 310)
                text('E-Mail',(windowWidth / 2) - 100, windowHeight - 240)
                break;
            case 'WarningScreen':
                image(warningScreenImg,windowWidth/2, windowHeight/2,windowWidth,windowWidth*(16/9));
                warningScreen.show();
                
                break;
            case 'GoodbyeScreen':
                background(0)
                emailInput.style('display', 'none');
                userInput.style('display', 'none');
                sendBottom.style('display', 'none');
                fill(255);
                image(goodScreenImg,windowWidth/2, windowHeight/2,windowWidth,windowWidth*(16/9));
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
                screenController = 'WarningScreen'
                socket.emit('mobile-screen', {
                screen: 'EndGameScreen'});}
            }
            break;  
            case 'WarningScreen':
            warningScreen.touched();
            warningScreen.touched2();
                break;
            case 'EndGameScreen':
                endGameScreen.touched();
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

function userInputFuntion(){ 
    userName = this.value();
    
}

function emailInputFuntion () {
    userEmail = this.value();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function newCursor(x, y) {
    noStroke();
    fill(255);
    ellipse(x, y, 10, 10);
}

function sendUserInfo(){
    if(userName&& userEmail){
                screenController = 'GoodbyeScreen'
                socket.emit('mobile-screen', {
                screen: 'GoodbyeScreen'
            })
            socket.emit('mobile-userInfo',{
                name: userName,
                email: userEmail,
            })
    }
    console.log(userName, userEmail)
}

socket.on('mobile-endGame', message => {
    let { endGameInfo } = message;
    endGame = endGameInfo;
});


