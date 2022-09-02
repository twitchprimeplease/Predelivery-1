const NGROK = `https://${window.location.hostname}`;
let socket = io(NGROK, { path: '/real-time' });
console.log('Server IP: ', NGROK);

let deviceWidth, deviceHeight = 0;
let mupiWidth, mupiHeight = 0;
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

let bombImage;
let StartScreenImg;
let QRImg;
let instructionsScreenImg;
let playScreenImg;
let endGameScreen;
let head1Img;
let head2Img;
let head3Img;
let head4Img;
let chest1Img;
let chest2Img;
let chest3Img;
let chest4Img;
let legs1Img;
let legs2Img;
let legs3Img;
let legs4Img;
let baseImg;

let screenController = 'StartScreen';
let generator = true;


function preload(){
    bombImage = loadImage('./Images/img_bomb.png')
    StartScreenImg = loadImage('./Images/StartScreen_Mupi.png')
    QRImg = loadImage('./Images/QR_Mupi.png')
    instructionsScreen = loadImage('./Images/InstructionsScreen_Mupi.png');
    playScreenImg = loadImage('./Images/PlayScreen_Mupi.png');
    endGameScreen = loadImage('./Images/EndGameScreen_Mupi.png');
    head1Img = loadImage('./Images/img_head1.png');
    head2Img = loadImage('./Images/img_head2.png');
    head3Img = loadImage('./Images/img_head3.png');
    head4Img = loadImage('./Images/img_head4.png');
    chest1Img = loadImage('./Images/img_chest1.png')
    chest2Img = loadImage('./Images/img_chest2.png')
    chest3Img = loadImage('./Images/img_chest3.png')
    chest4Img = loadImage('./Images/img_chest4.png')
    legs1Img = loadImage('./Images/img_legs1.png')
    legs2Img = loadImage('./Images/img_legs2.png')
    legs3Img = loadImage('./Images/img_legs3.png')
    legs4Img = loadImage('./Images/img_legs4.png')
    baseImg = loadImage('./Images/img_base.png')
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
    
}

function draw() {
    background(255);
    newCursor(pmouseX, pmouseY,255);
    imageMode(CENTER);
    switch (screenController){
        case 'StartScreen':
            image(StartScreenImg,windowWidth/2, windowHeight/2,windowWidth ,(windowWidth)*(3/2));
            image(QRImg,windowWidth/2, windowHeight/2 - 100, 221,221)
            break;
        case 'InstructionsScreen':
            image(instructionsScreen,windowWidth/2, windowHeight/2,windowWidth ,(windowWidth)*(3/2));
            break;
        case 'PlayScreen':
            image(playScreenImg,windowWidth/2, windowHeight/2,windowWidth ,(windowWidth)*(3/2));
            playTheGame()
            fill(0);
            
            //rect(baseController, heightController, 100, 50);
            fill(130);
            rectMode(CORNER);
            //rect(baseController - 75, heightController, 100, 50);
            image(baseImg,baseController + 15, heightController + 20, 200,74)
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
                resetPieces();
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

            image(endGameScreen,windowWidth/2, windowHeight/2,windowWidth ,(windowWidth)*(3/2));
            let yourLego = [];
            pieces.forEach((element, i) => {
                if(element.getIsStacked() != true){
                    pieces.splice(i, 1);
                } else if (element.getIsStacked() === true){
                    yourLego.push(element);
                } 
            

            });
            yourLego[0].showEnd(windowWidth/2, windowHeight/2+225)
            yourLego[1].showEnd(windowWidth/2, windowHeight/2+95)
            yourLego[2].showEnd(windowWidth/2, windowHeight/2-20)
            break;
            
    }

}

function mousePressed(){

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
            pieces.push(new HeadPiece(head1Img,head2Img,head3Img,head4Img))
            break;
        case 2:
            pieces.push(new ChestPiece(chest1Img,chest2Img,chest3Img,chest4Img))
            break;
        case 3:
            pieces.push(new Legspiece(legs1Img,legs2Img,legs3Img,legs4Img))
            break;

    }

    sleep(2500).then(function() {
        pieceGenerator();
    })
}
function bombGenerator(){ //funcion para generar bombas 

           // pieces.push(new BombPiece(bombImage));

    sleep(2000).then(function() {
        bombGenerator();
    })
}

class Piece {
    constructor(image1,image2,image3,image4){
        this.x = random(0,windowWidth-70);
        this.y = 0;
        this.vel = 3;
        this.collision = false; 
        const rancolor = Math.floor(random(1,5))
        this.colSelctor = rancolor
        this.id = "generic";
        this.isStacked = false;
        this.image1 =image1
        this.image2 = image2
        this.image3 = image3;
        this.image4 = image4;

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

        if (dist(this.y, this.x, pHeightController, this.x)<=20 && this.collision == false) {
            if (dist(this.y, this.x, this.y, baseController)<=150) {
                if(this.id =="Head"&&isHead === false && isBody === true) {
                    isHead = true;
                    this.collision = true;
                    pHeightController = pHeightController - 20;
                } else if (this.id =="Chest"&&isBody === false && isLeg === true){
                    isBody = true;
                    this.collision = true;
                    pHeightController = pHeightController - 50;
                } else if (this.id =="Legs"&&isLeg === false){
                    isLeg = true;
                    this.collision = true;
                    pHeightController = pHeightController - 80;
                } else if (this.id =="Bomb" && isHead === false){
                    resetPieces();
                    this.collision = true;
                }
            }
        }

        if (this.collision == false){
            this.y += this.vel;
        }else {
            this.x = baseController -25; 
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

    constructor(image1,image2,image3,image4){ 
        super();
        this.id = "Head";
        this.image1 =image1
        this.image2 = image2
        this.image3 = image3;
        this.image4 = image4;
    }

    show(){
        // fill(0)
        // rect(this.x, this.y, 70, 20);
        switch(this.colSelctor){
            
            case 1:
                image(this.image1,this.x + 35, this.y - 10,55,53)
                fill(255,0,0)
                break;
            case 2:
                image(this.image2,this.x + 35, this.y - 10,55,53)
                fill(95,10,135)
                break;
            case 3:
                image(this.image3,this.x + 37, this.y -15,55,75)
                fill(161,181,216)
                break;
            case 4:
                image(this.image4,this.x + 35, this.y - 10,55,53)
                fill(161,30,216)
                break;
        }
        

    }

    showEnd(x, y) { //aqui para mostrar cuando se haya armado y esté en la ultima pantalla del mupi
        switch(this.colSelctor){
            
            case 1:

                image(this.image1,x,y - 10,146,130)

                break;
            case 2:
                image(this.image2,x,y - 10,116,118)

                break;
            case 3:
                image(this.image3,x,y -15,116,168)

                break;
            case 4:
                image(this.image4,x,y - 10,114,111)

                break;
        }
        
    }
}

class ChestPiece extends Piece {

    constructor(image1,image2,image3,image4){ 
        super();
        this.id = "Chest";
        this.image1 =image1
        this.image2 = image2
        this.image3 = image3;
        this.image4 = image4;
    }
    show(){
        switch(this.colSelctor){
            case 1:
                image(this.image1,this.x + 35, this.y - 10,125,111)
                fill(255,0,0)
                break;
            case 2:
                image(this.image2,this.x + 35, this.y - 10,125,111)
                fill(95,10,135)
                break;
            case 3:
                image(this.image3,this.x + 35, this.y - 10,125,111)
                fill(161,181,216)
                break;
            case 4:
                image(this.image4,this.x + 35, this.y - 10,125,111)
                fill(161,30,216)
                break;
        }
    }

    showEnd(x, y) { //aqui para mostrar cuando se haya armado y esté en la ultima pantalla del mupi
        switch(this.colSelctor){
            
            case 1:

                image(this.image1,x,y - 10,261,232)

                break;
            case 2:
                image(this.image2,x,y - 10,261,232)

                break;
            case 3:
                image(this.image3,x,y -10,261,232)

                break;
            case 4:
                image(this.image4,x,y - 10,261,232)

                break;
        }
        
    }
}

class Legspiece extends Piece {

    constructor(image1,image2,image3,image4){ 
        super();
        this.id = "Legs";
        this.image1 =image1
        this.image2 = image2
        this.image3 = image3;
        this.image4 = image4;
    }
    show(){
        switch(this.colSelctor){
            case 1:
                image(this.image1,this.x + 35, this.y - 33,79,102)
                fill(255,0,0)
                break;
            case 2:
                image(this.image2,this.x + 35, this.y - 33,79,102)
                fill(95,10,135)
                break;
            case 3:
                image(this.image3,this.x + 35, this.y - 33,79,102)
                fill(161,181,216)
                break;
            case 4:
                image(this.image4,this.x + 35, this.y - 33,79,102)
                fill(161,30,216)
                break;
        }

    }
    showEnd(x, y) { //aqui para mostrar cuando se haya armado y esté en la ultima pantalla del mupi
        switch(this.colSelctor){
            
            case 1:

                image(this.image1,x,y - 10,175,227)

                break;
            case 2:
                image(this.image2,x,y - 10,175,227)

                break;
            case 3:
                image(this.image3,x,y -15,175,227)

                break;
            case 4:
                image(this.image4,x,y - 10,175,227)

                break;
        }
        
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
        generator = false;
    }
    
}

//esperar temporalmente 
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


});

socket.on('mupi-screen', message => {
    const { screen } = message;
    screenController = screen;
    console.log(screenController);
});