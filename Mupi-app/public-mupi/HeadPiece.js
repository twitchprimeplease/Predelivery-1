class HeadPiece extends Piece {

    constructor(){ 
        super();
        this.id = "Head";
        this.image = imageManager.headGenerator()
        //this.soundeffect = soundManager.bombsound()
    }

    show(){
        
        
        //circle(this.x +35,this.y,75);
        // switch(this.colSelctor){
        //     case 1:
        //         fill(255,0,0)
        //         break;
        //     case 2:
        //         fill(95,10,135)
        //         break;
        //     case 3:
        //         fill(161,181,216)
        //         break;
        //     case 4:
        //         fill(161,30,216)
        //         break;
        // }
        //rect(this.x, this.y, 70, 20);
        image(this.image, this.x + 35, this.y -20 ,82,99);

    }

    /*
    playSoundeffect(){ play(this.soundeffect)}

    */
}