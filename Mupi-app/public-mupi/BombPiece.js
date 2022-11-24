class BombPiece extends Piece {
    constructor(image){ 
        super();
        this.id = "Bomb";
        this.vel = 3;
        this.image = image;
        //this.soundeffect = soundManager.bombsound()
    }

    show(){ 
        // fill(0);
        // rect(this.x, this.y, 70, 20);
        image(this.image,this.x + 50, this.y,101,36)
    }

    move(){

        if (dist(this.y, this.x, heightController, this.x)<=20 && this.collision == false) {
            if (dist(this.y, this.x, this.y, baseController)<=150) {
                if (this.id =="Bomb" && isHead === false){
                    //this.playSoundeffect()
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
    /*
    playSoundeffect(){ play(this.soundeffect)}

    */
}