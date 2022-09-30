class Piece {
    constructor(){
        this.x = random(0,windowWidth-70);
        this.y = 0;
        this.vel = 3;
        this.collision = false; 
        const rancolor = Math.floor(random(1,5))
        this.colSelctor = rancolor
        this.id = "generic";
        this.isStacked = false;

    }

    show(){
        switch(this.colSelctor){
            case 1:
                fill(255,255,0);
                break;
            case 2:
                fill(206,71,96)
                break;
            case 3:
                fill(107,15,26)
                break;
        }
        //rect(this.x, this.y, 70, 20);
    }


    move(){

        if (dist(this.y, this.x, pHeightController, this.x)<=20 && this.collision == false) {
            if (dist(this.y, this.x, this.y, baseController)<=150) {
                if(this.id =="Head"&&isHead === false && isBody === true) {
                    isHead = true;
                    this.collision = true;
                    pHeightController = pHeightController - 20;
                } else if (this.id =="Chest"&&isBody === false && isLeg === true){
                    isBody = true;
                    this.collision = true;
                    pHeightController = pHeightController - 50;
                } else if (this.id =="Legs"&&isLeg === false){
                    isLeg = true;
                    this.collision = true;
                    pHeightController = pHeightController - 80;
                } else if (this.id =="Bomb" && isHead === false){
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
    showEnd(x, y) { //aqui para mostrar cuando se haya armado y esté en la ultima pantalla del mupi
        image(this.image,x,y);
        
    }

    getX(){ return this.x}

    getY(){ return this.y}

    getIsStacked(){ return this.isStacked}

    getCollision() { return this.collision}

    getId() { return this.id}

    setX(newX) { this.x = newX}
    setY(newY) { this.y = newY}
}