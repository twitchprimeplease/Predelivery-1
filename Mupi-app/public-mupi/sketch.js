const NGROK = `https://${window.location.hostname}`;
let socket = io(NGROK, { path: '/real-time' });
console.log('Server IP: ', NGROK);

let deviceWidth, deviceHeight = 0;
let mupiWidth, mupiHeight = 0;
let baseController = 0;
let pieces = [];
let bombs = [];
let heightController = 0;
let pHeightController = 0;
let baseWeight = 200;
let baseHeight = 50;
let isHead = false;
let isBody = false;
let isLeg = false;
let arduinoinsA = 0;
let arduinoinsB = 0;
let arduinodistance = 0;
let disValues = [];
let contador = 0;
let prevPosition = 0;

let toReset = null;

let bombImage;
let StartScreenImg;
let QRImg;
let instructionsScreenImg;
let playScreenImg;
let endGameScreen;
let baseImg;
let endScreenImg;
let goodbyeScreenImg;

let screenController = 'PlayScreen';
let generator = true;
let imageManager;

let tryHead;
let tryChest;
let tryLegs;

let explotion = false;
let explotionImg;
let temporalExp;
let temporalX;
let temporalY;

function preload(){
    bombImage = loadImage('./Images/img_bomb.png')
    StartScreenImg = loadImage('./Images/StartScreen_Mupi.png')
    QRImg = loadImage('./Images/QR_Mupi.png')
    instructionsScreen = loadImage('./Images/InstructionsScreen_Mupi.png');
    instructionsScreen2 = loadImage('./Images/InstructionsScreen2_Mupi.png');
    playScreenImg = loadImage('./Images/PlayScreen_Mupi.png');
    endGameScreen = loadImage('./Images/EndGameScreen_Mupi.png');
    baseImg = loadImage('./Images/img_base.png');
    imageManager = new ImageManager();
    endScreenImg = loadImage('./Images/EndScreen_Mupi.png');
    goodbyeScreenImg = loadImage('./Images/GoodbyeScreen_Mupi.png');
    explotionImg = loadImage('./Images/explotion/explotion.gif')
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    mupiWidth = windowWidth;
    mupiHeight = windowHeight;
    baseController = (windowHeight / 2);
    heightController = windowHeight - (windowHeight / 10);
    pHeightController = heightController;
    background(255);
    tryHead = new HeadPiece ();
    tryChest = new ChestPiece ();
    tryLegs = new Legspiece ();



}

function draw() {
    background(255);
    newCursor(pmouseX, pmouseY,255);
    imageMode(CENTER);

    
    
    switch (screenController){
        case 'StartScreen':
            image(StartScreenImg,windowWidth/2, windowHeight/2,windowWidth ,(windowWidth)*(3/2));
            if(arduinoinsA === 'A'){
                screenController = 'InstructionsScreen1'
                arduinoinsA = 0;
            }
            
            break;
        case 'InstructionsScreen1':
            image(instructionsScreen,windowWidth/2, windowHeight/2,windowWidth ,(windowWidth)*(3/2));
            if(arduinoinsA === 'A'){
                screenController = 'InstructionsScreen2'
                arduinoinsA = 0;
            }
            break;
            case 'InstructionsScreen2':
                image(instructionsScreen2,windowWidth/2, windowHeight/2,windowWidth ,(windowWidth)*(3/2));
                if(arduinoinsA === 'A'){
                    screenController = 'PlayScreen'
                    arduinoinsA = 0;
                }
                if(arduinoinsA === 'B'){
                    screenController = 'InstructionsScreen1'
                    arduinoinsA = 0;
                }
                break;
        case 'PlayScreen':
            image(playScreenImg,windowWidth/2, windowHeight/2,windowWidth ,(windowWidth)*(3/2));
            playTheGame();
            image(baseImg, baseController + 12, heightController - 60, 180,246)
            // fill(0);
            // rect(baseController, heightController, 100, 50);
            // fill(130);
            // rectMode(CORNER);
            // rect(baseController - 75, heightController, 100, 50);
            pieces.forEach((element, i) => {
            element.show();
            element.move();
            if(element.getY() >=windowHeight){
                pieces.splice(i, 1);
            }
            if (toReset) {
                resetPieces();
                sleep(1000).then(function() {
                    toReset = false;
                });
            };
            });
            
            bombs.forEach((element, i) => {
                element.show();
                element.move();
                if(element.getCollision() === true) {
                    temporalX = element.getX() + 50;
                    temporalY = element.getY();
                    explotion = true;
                    
                    pieces.splice(i, 1);
                }
            });
            animateExplotions(temporalX,temporalY);
        if (isHead === true){
            socket.emit('mupi-endGame', {endGameInfo: true});
            bombs.splice(0, bombs.length);
            if(arduinoinsA === 'A'){
                screenController = 'EndGameScreen'
                arduinoinsA = 0;
            }
            if(arduinoinsB === 'B'){
                resetPieces();
                arduinoinsB = 0;
            }
        }

        
            break;
        case 'EndGameScreen':

            image(endGameScreen,windowWidth/2, windowHeight/2,windowWidth ,(windowWidth)*(3/2));
            let yourLego = [];
            pieces.forEach((element, i) => {
                if(element.getIsStacked() != true){
                    pieces.splice(i, 1);
                } else if (element.getIsStacked() === true){
                    yourLego.push(element);
                } 
            
            });
            yourLego[0].showEnd(windowWidth/2, windowHeight/2+200,164,222);
            yourLego[1].showEnd(windowWidth/2, windowHeight/2 + 68,302,255);
            yourLego[2].showEnd(windowWidth/2, windowHeight/2-90,194,233);
            
            if(arduinoinsA === 'A'){
                screenController = 'EndScreen'
                arduinoinsA = 0;
            }
            break;
            case 'EndScreen':
                image(endScreenImg,windowWidth/2, windowHeight/2,windowWidth ,(windowWidth)*(3/2));
                image(QRImg,windowWidth/2, windowHeight/2 - 30, 221,221)
                if(arduinoinsB === 'B'){
                    screenController = 'GoodbyeScreen'
                    arduinoinsB = 0;
                }
                break;
            case 'GoodbyeScreen':
                image(goodbyeScreenImg,windowWidth/2, windowHeight/2,windowWidth ,(windowWidth)*(3/2));
                break;
            
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

function pieceGenerator(){ //funcion para generar piezas 
    let piece = Math.floor(random(1,4));
    switch(piece){
        case 1:
            pieces.push(new HeadPiece());
            break;
        case 2:
            pieces.push(new ChestPiece());
            break;
        case 3:
            pieces.push(new Legspiece());
            break;

    }

    sleep(2500).then(function() {
        pieceGenerator();
    })
}
function bombGenerator(){ //funcion para generar bombas 

        bombs.push(new BombPiece(bombImage));

    sleep(2000).then(function() {
        bombGenerator();
    })
}
function playTheGame() {
    if (generator){
        pieceGenerator();
        bombGenerator();
        generator = false;
    }
    
}

function sleep(millisecondsDuration) {
    return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
    });
}

function startPiece() {
    pieces.push(new HeadPiece());
    sleep(3000).then(function() {
        startPiece();
    });
};

function animateExplotions(x,y) {
    if(explotion){
    image(explotionImg,x,y);
    temporalExp = setTimeout(() => {
        explotion = false;
    },1000)
    }
    
}


function resetPieces() {
    pieces.splice(0, pieces.length);
    bombs.splice(0, bombs.length);
            isHead = false;
            isBody = false;
            isLeg = false;
            pHeightController = heightController;
}

socket.on('mupi-instructions', instructions => {
    console.log('ID: ' + socket.id);

    let { interactions } = instructions;
    switch (interactions) {
        case 0:
            let { pmouseX } = instructions;
            baseController = (pmouseX * mupiWidth) / deviceWidth
            break;
    }

});

socket.on('mupi-size', deviceSize => {
    let { windowWidth, windowHeight } = deviceSize;
    deviceWidth = windowWidth;
    deviceHeight = windowHeight;
    console.log(`User is using a smartphone size of ${deviceWidth} and ${deviceHeight}`);
});

socket.on('mupi-reset', message => {
    const {resetInfo} = message;
    toReset = resetInfo ;


});

socket.on('mupi-screen', message => {
    const { screen } = message;
    screenController = screen;
    console.log(screenController);
});

socket.on('arduino', arduinioMessage => {
    let { botonA } = arduinioMessage;
    let { botonB } = arduinioMessage;
    arduinoinsA = botonA;
    arduinoinsB = botonB;
    let { distance } = arduinioMessage;
    if (distance < 100 ) {
        baseController = (distance/100) * mupiWidth;
    }
    addToListDo(distance);

});

function addToListDo(value){
    do {
        disValues.push(value);
    } while(disValues.length < 15 && screenController === 'PlayScreen')
}

function addToList(value){
    if(disValues.length < 15 && screenController === 'PlayScreen'){
        disValues.push(value);
        
    }
}

function moveBaseController(){
    if(disValues.length === 15){
        let result = promedio(disValues);
        
        if (result != prevPosition) {
            let newDis = (result/100) * mupiWidth
            baseController = newDis;
        prevPosition = newDis;
        disValues.splice(1, disValues.length)
        }else {
            baseController = prevPosition;
        }
        
    } 
}

function promedio(array) {
    let i = 0, summ = 0, ArrayLen = array.length;
    while (i < ArrayLen) {
        summ = summ + array[i++];
}
    return summ / ArrayLen;
}