class Cloud extends MovableObject{

    y = 50;
    width = 72;
    height = 64;

    /**
     * Creates a new cloud object with random position and starts animation
     * @function constructor
     * @returns {void}
     */
    constructor() {
        super();
        this.loadImage('./assets/clouds/Cloud1.png');

        this.x = Math.random() * 500;
        this.animate();
    }

    /**
     * Starts the cloud animation by moving it to the left
     * @function animate
     * @returns {void}
     */
    animate() {
        this.moveLeft();
    }
}