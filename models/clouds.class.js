class Cloud extends MovableObject{

    y = 50;
    width = 500;
    height = 250;


    constructor() {
        super();
        this.loadImage('./img_pollo_locco/img/5_background/layers/4_clouds/1.png');

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