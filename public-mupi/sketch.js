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
let validateComplete = false;
let heightController = 0;
let pHeightController = 0;

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
    baseController = (windowHeight / 2) + 200;
    heightController = windowHeight - (windowHeight / 10);
    pHeightController = heightController
    background(0);
    startPiece();

}

function draw() {
    background(0, 5);
    newCursor(pmouseX, pmouseY,255);
    fill(255, 0, 0);
    ellipse(controllerX, controllerY, ballSize, ballSize);
    rect(baseController, heightController, 200, 50);
    //posY += velY
    if(posY <=windowHeight){
        ellipse(windowWidth / 2,posY, ballSize, ballSize);
    }

    pieces.forEach(element => {
        element.show();
        element.move();
    });


    
    

}

function mousePressed(){
    pieces.forEach(element => {
        console.log(element.getX());
    });
    
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

function pieceGenerator(piece){ //funcion para generar piezas 
    switch(piece){
        case 1:
            pieces.push(new HeadPiece())
            break;
        case 2:
            piece.push(new ChestPiece)
            break;
        case 3:
            pieces.push(new Legspiece)
            break;
    }
}

class Piece {
    constructor(){
        this.x = random(0,windowWidth);
        this.y = 0;
        this.vel = 1;
        this.collision = false; 
    }

    show(){
        //console.log(this.x);
        fill(255,255,0);
        rect(this.x, this.y, 70, 20);
    }
    
    move(){
        //console.log(dist(this.y, this.x, heightController, this.x));
        if (dist(this.y, this.x, pHeightController, this.x)<=25 && this.collision == false) {
            if (dist(this.y, this.x, this.y, baseController)<=200) {
                this.collision = true;
                pHeightController = pHeightController - 20;
            }
        }
        if (this.collision == false){
            this.y += this.vel;
        }else{
            this.x = baseController + 65;
        }

        
    }

    getX(){ return this.x}

    getY(){ return this.y}
}

class HeadPiece extends Piece {

    show(){
        console.log(this.x);
        fill(255,0,0);
        rect(this.x, this.y, 200, 200);
    }
}

class ChestPiece extends Piece {

    show(){
        console.log(this.x);
        fill(0,255,0);
        rect(this.x, this.y, 200, 200);
    }
}

class Legspiece extends Piece {

    show(){
        console.log(this.x);
        fill(0,0,255);
        rect(this.x, this.y, 200, 200);
    }
}

socket.on('mupi-instructions', instructions => {
    console.log('ID: ' + socket.id);

    let { interactions } = instructions;
    switch (interactions) {
        case 0:
            let { pmouseX } = instructions;
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
    }

});

socket.on('mupi-size', deviceSize => {
    let { windowWidth, windowHeight } = deviceSize;
    deviceWidth = windowWidth;
    deviceHeight = windowHeight;
    console.log(`User is using a smartphone size of ${deviceWidth} and ${deviceHeight}`);
});

//esperar temporalmente 
function sleep(millisecondsDuration)
{
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  })
}

function startPiece() {
    pieces.push(new Piece());
    sleep(3000).then(function() {
        startPiece();
    })
}