class Scroll extends MovableObject {
    width = 40;
    height = 40;

    collisionOffsetX = 5;
    collisionOffsetY = 5;
    collisionWidth = 30;
    collisionHeight = 30;

    healthRestore = 20;
    manaRestore = 20;
    collected = false;

    /**
     * Creates a new scroll collectible object
     * @function constructor
     * @param {number} x - The x position of the scroll
     * @param {number} y - The y position of the scroll
     * @returns {void}
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage('./assets/collectibles/scroll.png');
    }

    /**
     * Draws the collision frame for debugging purposes
     * @function drawFrame
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @returns {void}
     */
    drawFrame(ctx) {
        if (!CONFIG.SHOW_COLLISION_BOXES) return;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'green';
        ctx.rect(
            this.x + this.collisionOffsetX,
            this.y + this.collisionOffsetY,
            this.collisionWidth,
            this.collisionHeight
        );
        ctx.stroke();
    }
}
