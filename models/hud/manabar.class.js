class ManaBar extends StatusBar {
    /**
     * Initializes a new mana bar with position
     * @function constructor
     * @param {number} x - X position of the mana bar
     * @param {number} y - Y position of the mana bar
     * @returns {void}
     */
    constructor(x, y) {
        super(x, y);
    }

    /**
     * Draws the mana bar with current mana percentage
     * @function draw
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    draw(ctx) {
        let barX = this.x + 93;
        let barY = this.y + 70;
        let barWidth = 110;
        let barHeight = 15;

        ctx.fillStyle = 'rgba(0, 0, 50, 0.8)';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        let currentBarWidth = (barWidth * this.percentage) / 100;
        ctx.fillStyle = '#1976d2';
        ctx.fillRect(barX, barY, currentBarWidth, barHeight);

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}
