class Cloud extends MovableObject{

    y = 50;
    width = 72;
    height = 64;


    constructor() {
        super();
        this.loadImage('./assets/clouds/Cloud1.png');

        this.x = Math.random() * 500; // zahl zwischen 200 und 700
        this.animate();

        // this.x = Math.random() * 500;
        // this.y = 20;
        // this.width = 500;
        // this.height = 250;
    }

    animate() {
        this.moveLeft();
    }
}