class BackgroundObject extends MovableObject {

    width = 721;
    height = 480;
    
    /**
     * Creates a new background object with specified image and position
     * @function constructor
     * @param {string} imagePath - Path to the background image
     * @param {number} x - Horizontal position of the background object
     * @returns {void}
     */
    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);
        this.y = 480 - this.height;
        this.x = Math.round(x);
    }
}