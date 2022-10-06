class ImageManager {
    constructor(){
        this.headImages = [
            loadImage('./Images/img_head1.png'),
            loadImage('./Images/img_head2.png'),
            loadImage('./Images/img_head3.png'),
            loadImage('./Images/img_head4.png'),
            loadImage('./Images/img_head5.png'),
            loadImage('./Images/img_head6.png'),
            loadImage('./Images/img_head7.png'),
            loadImage('./Images/img_head8.png'),

        ]
        this.chestImages = [
            loadImage('./Images/img_chest1.png'),
            loadImage('./Images/img_chest2.png'),
            loadImage('./Images/img_chest3.png'),
            loadImage('./Images/img_chest4.png'),
            loadImage('./Images/img_chest5.png'),
            loadImage('./Images/img_chest6.png'),
            loadImage('./Images/img_chest7.png'),
            loadImage('./Images/img_chest8.png'),
        ]
        this.legsImages = [
            loadImage('./Images/img_legs1.png'),
            loadImage('./Images/img_legs2.png'),
            loadImage('./Images/img_legs3.png'),
            loadImage('./Images/img_legs4.png'),
            loadImage('./Images/img_legs5.png'),
            loadImage('./Images/img_legs6.png'),
            loadImage('./Images/img_legs7.png'),
            loadImage('./Images/img_legs8.png'),
        ]
    }

    headGenerator(){ 
        const rNumber = Math.floor(random(0, this.headImages.length - 1));
        return this.headImages[rNumber];
    }

    chestGenerator(){
        const rNumber = Math.floor(random(0, this.chestImages.length - 1));
        return this.chestImages[rNumber];
    }

    legsGenerator(){ 
        const rNumber = Math.floor(random(0, this.legsImages.length - 1));
        return this.legsImages[rNumber];
    }

    getHeads(){return this.headImages};

    getChests(){return this.chestImages};

    getLegs() {return this.legsImages};
}