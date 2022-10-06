class WarningScreen {
    constructor(windowWidth,windowHeight){
        this.xB = windowWidth/3;
        this.yB = windowHeight - windowHeight/4;
        this.wB = windowWidth/3
        this.hB = windowHeight/15;

        this.xB2 = windowWidth/3;
        this.yB2 = windowHeight - windowHeight/3;
        this.wB2 = windowWidth/3
        this.hB2 = windowHeight/15;
    }

    show(){

        fill(87, 110, 228);
        rect(this.xB,this.yB,this.wB,this.hB,this.yB/2);
        fill(250)
        textSize(windowWidth/25)
        textAlign(CENTER,CENTER);
        text("En otra ocasión",this.xB + this.wB/2,this.yB + this.hB/2)

        fill(210,52,59);
        rect(this.xB2,this.yB2,this.wB2,this.hB2,this.yB2/2);
        fill(250)
        textSize(windowWidth/25)
        textAlign(CENTER,CENTER);
        text("Continuar",this.xB2 + this.wB2/2,this.yB2 + this.hB2/2)
    }

    touched(){
        if (pmouseX > this.xB &&pmouseY > this.yB && pmouseX < this.xB + this.wB && pmouseY < this.yB + this.hB){
            screenController = 'GoodbyeScreen'
        }
    }

    touched2(){
        if (pmouseX > this.xB2 && pmouseY > this.yB2 && pmouseX < this.xB2 + this.wB2 && pmouseY < this.yB2 + this.hB2){
            screenController = 'EndGameScreen'
        }
    }
}