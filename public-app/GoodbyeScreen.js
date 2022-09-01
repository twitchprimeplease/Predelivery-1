class GoodbyeScreen {
    constructor(windowWidth,windowHeight){
        this.xB = windowWidth/3;
        this.yB = windowHeight - windowHeight/10;
        this.wB = windowWidth/3
        this.hB = windowHeight/15;
    }

    show(){
        background(0)
        fill(111,148,230);
        rect(this.xB,this.yB,this.wB,this.hB);
        fill(250);
        textSize(windowWidth/25);
        textAlign(CENTER,CENTER);
        text("¡Hora de Jugar!",this.xB + this.wB/2,this.yB + this.hB/2)
    }

    touched(){
        if (pmouseX > this.xB &&pmouseY > this.yB && pmouseX < this.xB + this.wB && pmouseY < this.yB + this.hB){
            screenController = 'PlayScreen'
            socket.emit('mobile-screen', {screen: 'PlayScreen'})
        }

    }
}