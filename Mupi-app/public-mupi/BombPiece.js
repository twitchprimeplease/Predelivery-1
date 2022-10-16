class BombPiece extends Piece {
    constructor(image){ 
        super();
        this.id = "Bomb";
        this.vel = 3;
        this.image = image;
    }

    show(){ 
        // fill(0);
        // rect(this.x, this.y, 70, 20);
        image(this.image,this.x + 50, this.y,101,36)
    }
}