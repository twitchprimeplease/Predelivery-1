//import ImageManager from "./ImagesManager";
const NGROK = `https://${window.location.hostname}`;
let socket = io(NGROK, { path: '/real-time' });
console.log('Server IP: ', NGROK);

let controllerX, controllerY = 0;
let deviceWidth, deviceHeight = 0;
let mupiWidth, mupiHeight = 0;
let ballSize = 20;
let baseController = 0;
let pieces = [];
let heightController = 0;
let pHeightController = 0;
let baseWeight = 200;
let baseHeight = 50;
let isHead = false;
let isBody = false;
let isLeg = false;

let toReset = null;
let bombImage = ''

let screenController = 'PlayScreen';
let generator = true;


function preload(){
    bombImage = loadImage('./Images/img_bomb.png')
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
    mupiWidth = windowWidth;
    mupiHeight = windowHeight;
    baseController = (windowHeight / 2);
    heightController = windowHeight - (windowHeight / 10);
    pHeightController = heightController;
    background(255);
    
    
}

function draw() {
    background(255);
    newCursor(pmouseX, pmouseY,255);
    switch (screenController){
        case 'StartScreen':
            fill(0)
            text('Hola',100,100);
            break;
        case 'InstructionsScreen':
            text('Instrucciones',300,windowHeight / 2)
            break;
        case 'PlayScreen':
            playTheGame()
            fill(0);
        rect(baseController, heightController, 150, 50);
        fill(130);
        rect(baseController - 70, heightController, 150, 50);
        pieces.forEach((element, i) => {
        element.show();
        element.move();
        if(element.getY() >=windowHeight){
            pieces.splice(i, 1);
        }
        if(element.getCollision() === true && element.getId() == "Bomb"){
            pieces.splice(i, 1);
        }
        if (toReset) {
            resetPieces()
            sleep(1000).then(function() {
                toReset = false;
            });
        };
    });

        if (isHead === true){
            socket.emit('mupi-endGame', {endGameInfo: true});
        }
            break;
        case 'EndGameScreen':
            text('¡Este es tu lego!',windowWidth/2,windowHeight / 2);
            let yourLego = [];
            pieces.forEach((element, i) => {
                if(element.getIsStacked() != true){
                    pieces.splice(i, 1);
                } else if (element.getIsStacked() === true){
                    yourLego.push(element);
                }
                
            });
            break;

        case 'GoodbyeScreen':
            text('Thanks for Playing! Have a good day!', 500,500)
            break;
            
    }

}

function mousePressed(){
    //console.log(toReset);
    if (mouseX > baseController && mouseX < baseController + 200 && mouseY > heightController && mouseY < heightController + 50) {

                console.log("toque")
            
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
            pieces.push(new HeadPiece())
            break;
        case 2:
            pieces.push(new ChestPiece())
            break;
        case 3:
            pieces.push(new Legspiece())
            break;

    }

    sleep(2500).then(function() {
        pieceGenerator();
    })
}
function bombGenerator(){ //funcion para generar piezas 

            pieces.push(new BombPiece(bombImage));

    sleep(2000).then(function() {
        bombGenerator();
    })
}

class Piece {
    constructor(){
        this.x = random(0,windowWidth-70);
        this.y = 0;
        this.vel = 3;
        this.collision = false; 
        const rancolor = Math.floor(random(1,4))
        this.colSelctor = rancolor
        this.id = "generic";
        this.isStacked = false;

    }

    show(){
        switch(this.colSelctor){
            case 1:
                fill(255,255,0);
                break;
            case 2:
                fill(206,71,96)
                break;
            case 3:
                fill(107,15,26)
                break;
        }
        rect(this.x, this.y, 70, 20);
    }


    move(){

        if (dist(this.y, this.x, pHeightController, this.x)<=25 && this.collision == false) {
            if (dist(this.y, this.x, this.y, baseController)<=150) {
                if(this.id =="Head"&&isHead === false && isBody === true) {
                    isHead = true;
                    this.collision = true;
                    pHeightController = pHeightController - 20;
                } else if (this.id =="Chest"&&isBody === false && isLeg === true){
                    isBody = true;
                    this.collision = true;
                    pHeightController = pHeightController - 20;
                } else if (this.id =="Legs"&&isLeg === false){
                    isLeg = true;
                    this.collision = true;
                    pHeightController = pHeightController - 20;
                } else if (this.id =="Bomb" && isHead === false){
                    resetPieces();
                    this.collision = true;
                }
            }
        }

        if (this.collision == false){
            this.y += this.vel;
        }else {
            this.x = baseController; 
            this.isStacked = true;
        }
    }

    getX(){ return this.x}

    getY(){ return this.y}

    getIsStacked(){ return this.isStacked}

    getCollision() { return this.collision}

    getId() { return this.id}

    setX(newX) { this.x = newX}
    setY(newY) { this.y = newY}
}

class HeadPiece extends Piece {

    constructor(){ 
        super();
        this.id = "Head";
    }

    show(){
        switch(this.colSelctor){
            case 1:
                fill(255,0,0);
                break;
            case 2:
                fill(206,71,96)
                break;
            case 3:
                fill(107,15,26)
                break;
        }
        rect(this.x, this.y, 70, 20);

    }
}

class ChestPiece extends Piece {

    constructor(){ 
        super();
        this.id = "Chest";
    }
    show(){
        switch(this.colSelctor){
            case 1:
                fill(0,255,0);
                break;
            case 2:
                fill(144,227,154)
                break;
            case 3:
                fill(28,254,186)
                break;
        }
        //fill(0,255,0);
        rect(this.x, this.y, 70, 20);
    }
}

class Legspiece extends Piece {

    constructor(){ 
        super();
        this.id = "Legs";
    }
    show(){
        switch(this.colSelctor){
            case 1:
                fill(0,0,255);
                break;
            case 2:
                fill(95,10,135)
                break;
            case 3:
                fill(161,181,216)
                break;
        }
        //fill(0,0,255);
        rect(this.x, this.y, 70, 20);
    }
}

class BombPiece extends Piece {
    constructor(image){ 
        super();
        this.id = "Bomb";
        this.vel = 6;
        this.image = image;
    }

    show(){ 
        fill(0);
        //rect(this.x, this.y, 70, 20);
        image(this.image,this.x - 20, this.y - 40, 109,63)
    }
}

function playTheGame() {
    if (generator){
        pieceGenerator();
        bombGenerator();
        generator = false
    }
    
}

//esperar temporalmente 
function sleep(millisecondsDuration) {
    return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
    })
}

function startPiece() {
    pieces.push(new HeadPiece());
    sleep(3000).then(function() {
        startPiece();
    })
};

function resetPieces() {
    pieces.splice(0, pieces.length);
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
    console.log(toReset);

});

socket.on('mupi-screen', message => {
    const { screen } = message;
    screenController = screen;
    console.log(screenController);
});