class StatusBar {
    x = 20;
    y = 10;
    width = 250;
    height = 125;
    percentage = 100;

    /**
     * Initializes a new status bar with position
     * @function constructor
     * @param {number} x - X position of the status bar
     * @param {number} y - Y position of the status bar
     * @returns {void}
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Sets the percentage value for the status bar
     * @function setPercentage
     * @param {number} percentage - Percentage value to set (0-100)
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
    }

    /**
     * Draws the status bar on canvas (to be overridden in subclasses)
     * @function draw
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    draw(ctx) {
    }
}
