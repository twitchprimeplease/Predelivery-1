let socket = io("http://localhost:5050", { path: '/real-time' }) //asi es como se conecta al server, nos conectamos al server con io
//
let canvas;
let controllerX, controllerY = 0;

function setup() {
    frameRate(60);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    controllerX = windowWidth / 2;
    controllerY = windowHeight / 2;
    background(0);
}

function draw() {
    background(0,5);
    newCursor(pmouseX, pmouseY);
    fill(255);
    //ellipse(controllerX, controllerY, 50, 50)
    fill(255,0,0);
    ellipse(windowWidth / 2,windowHeight / 2, 200, 200)
    fill(255)
}

function mouseClick() {
    if(dist(mouseX,mouseY,windowWidth / 2,windowHeight / 2)>100){
        console.log('No lo has olvidado :D')
    }
}

function mouseDragged() {
    //console.log({pmouseX, pmouseY});
    //socket.emit('positions',{controlX: pmouseX, controlY: pmouseY});
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function newCursor(x, y) {
    noStroke();
    fill(255);
    ellipse(x, y, 10, 10);
}

socket.on('display-positions', message => {
    let {controlX, controlY} = message;

    console.log('Datos del Servidor', message)
});