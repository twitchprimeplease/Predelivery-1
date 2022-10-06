class StartScreen {
    constructor(windowWidth,windowHeight){
        this.xB = windowWidth/3 - 30;
        this.yB = windowHeight - windowHeight/2;
        this.wB = windowWidth/2;
        this.hB = windowHeight/15;
    }

    show(){
  
        fill(210,52,59);
        
        rect(this.xB,this.yB,this.wB,this.hB,this.yB/2);
        fill(250)
        textSize(windowWidth/22)
        textAlign(CENTER,CENTER);
        text("Instrucciones",this.xB + this.wB/2,this.yB + this.hB/2)
    }

    touched(){
        if (pmouseX > this.xB &&pmouseY > this.yB && pmouseX < this.xB + this.wB && pmouseY < this.yB + this.hB){
            screenController = 'InstructionsScreen'
            socket.emit('mobile-screen', {

            screen: 'InstructionsScreen'
        })
        }

    }
}