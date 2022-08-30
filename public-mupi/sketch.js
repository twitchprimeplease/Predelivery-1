const NGROK = `https://${window.location.hostname}`;
let socket = io(NGROK, { path: '/real-time' });
console.log('Server IP: ', NGROK);

let controllerX, controllerY = 0;
let deviceWidth, deviceHeight = 0;
let mupiWidth, mupiHeight = 0;
let ballSize = 20;
let baseController = 0;
let posY = 0;
let velY = 2;
let pieces = [];
let heightController = 0;
let pHeightController = 0;
let baseWeight = 200;
let baseHeight = 50;
let isHead = false;
let isBody = false;
let isLeg = false;

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
    baseController = (windowHeight / 2) + baseWeight;
    heightController = windowHeight - (windowHeight / 10);
    pHeightController = heightController
    background(255);
    pieceGenerator()

}

function draw() {
    background(255);
    newCursor(pmouseX, pmouseY,255);
    fill(0);
    rect(baseController, heightController, 200, 50);
    pieces.forEach((element, i) => {
        element.show();
        element.move();
        if(element.getY() >=windowHeight){
            pieces.splice(i, 1);

        }
    });
}

function mousePressed(){
    pieces.forEach(element => {
        console.log(element.getX());
    });
    pieces.push(new HeadPiece())
    
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
        case 4:
            break;
    }

    sleep(2500).then(function() {
        pieceGenerator();
    })
}

class Piece {
    constructor(){
        this.x = random(0,windowWidth);
        this.y = 0;
        this.vel = 3;
        this.collision = false; 
        const rancolor = Math.floor(random(1,4))
        this.colSelctor = rancolor
        this.id = "generic";

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
            if (dist(this.y, this.x, this.y, baseController)<=200) {

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
                }
            }
        }

        if (this.collision == false){
            this.y += this.vel;
        }else {
            this.x = baseController + 65;  
        }
    }

    getX(){ return this.x}

    getY(){ return this.y}
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
        //fill(255,0,0);
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

//esperar temporalmente 
function sleep(millisecondsDuration)
{
    return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
    })
}

function startPiece() {
    pieces.push(new HeadPiece());
    sleep(3000).then(function() {
        startPiece();
    })
}

socket.on('mupi-instructions', instructions => {
    console.log('ID: ' + socket.id);

    let { interactions } = instructions;
    switch (interactions) {
        case 0:
            let { pmouseX } = instructions;
            baseController = (pmouseX * mupiWidth) / deviceWidth
            break;
        // case 1:
        //     let { pAccelerationX, pAccelerationY, pAccelerationZ } = instructions;
        //     ballSize = pAccelerationY < 0 ? pAccelerationY * -2 : pAccelerationY * 2;
        //     break;
        // case 2:
        //     let { rotationX, rotationY, rotationZ } = instructions;
        //     controllerY = (rotationX * mupiHeight) / 90;
        //     controllerX = (rotationY * mupiWidth) / 90;
        //     break;
    }

});

socket.on('mupi-size', deviceSize => {
    let { windowWidth, windowHeight } = deviceSize;
    deviceWidth = windowWidth;
    deviceHeight = windowHeight;
    console.log(`User is using a smartphone size of ${deviceWidth} and ${deviceHeight}`);
});