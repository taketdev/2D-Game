class Chicken extends MovableObject{

    y = 350;
    height = 100;
    width = 80;

    constructor() {
        super();
        this.loadImage('./img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');

        this.x = 200 + Math.random() * 500;
    }

    moveLeft(){

    }
}