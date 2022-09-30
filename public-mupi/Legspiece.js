class Legspiece extends Piece {

    constructor(){ 
        super();
        this.id = "Legs";
        this.image = imageManager.legsGenerator()
    }
    show(){
        image(this.image,this.x + 35, this.y - 33,79,102)
        switch(this.colSelctor){
            case 1:
                //image(this.image1,this.x + 35, this.y - 33,79,102)
                fill(255,0,0)
                break;
            case 2:
                //image(this.image2,this.x + 35, this.y - 33,79,102)
                fill(95,10,135)
                break;
            case 3:
                //image(this.image3,this.x + 35, this.y - 33,79,102)
                fill(161,181,216)
                break;
            case 4:
                //image(this.image4,this.x + 35, this.y - 33,79,102)
                fill(161,30,216)
                break;
        }
        //rect(this.x, this.y, 70, 20);
    }
}