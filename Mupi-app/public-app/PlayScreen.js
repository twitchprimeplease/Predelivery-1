class PlayScreen {
    constructor(windowWidth,windowHeight){
        this.xB = windowWidth/3;
        this.yB = windowHeight - windowHeight/10;
        this.wB = windowWidth/3
        this.hB = windowHeight/15;
        this.endGame = false;
    }

    show(){
        fill(111,148,230);
        rect(this.xB,this.yB,this.wB,this.hB,this.yB/2);
        fill(250);
        textSize(windowWidth/25);
        textAlign(CENTER,CENTER);
        text("┬íReinicia tu lego!",this.xB + this.wB/2,this.yB + this.hB/2)
    }

    getxB(){ return this.xB}
    getyB(){ return this.yB}
    getwB(){ return this.wB}
    gethB(){ return this.hB}
}