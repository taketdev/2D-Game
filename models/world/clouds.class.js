class Cloud extends MovableObject{

    y = 50;
    width = 72;
    height = 64;


    constructor() {
        super();
        this.loadImage('./assets/clouds/Cloud1.png');

        this.x = Math.random() * 500;
        this.animate();
    }

    animate() {
        this.moveLeft();
    }
}