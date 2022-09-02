class InstructionsScreen {
    constructor(windowWidth,windowHeight){
        this.xB = windowWidth/3;
        this.yB = windowHeight - windowHeight/10;
        this.wB = windowWidth/3
        this.hB = windowHeight/15;
    }

    show(){

        fill(87, 110, 228);
        rect(this.xB,this.yB,this.wB,this.hB,this.yB/2);
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