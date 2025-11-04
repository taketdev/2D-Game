class BossHealthBar extends StatusBar {
    bossHealthBarImage;

    /**
     * Initializes a new boss health bar with position and dimensions
     * @function constructor
     * @param {number} x - X position of the health bar
     * @param {number} y - Y position of the health bar
     * @returns {void}
     */
    constructor(x, y) {
        super(x, y);
        this.width = 120;
        this.height = 41;
        this.loadBossHealthBarImage();
    }

    /**
     * Loads the boss health bar background image
     * @function loadBossHealthBarImage
     * @returns {void}
     */
    loadBossHealthBarImage() {
        this.bossHealthBarImage = new Image();
        this.bossHealthBarImage.src = './assets/hud/bossHealthBar.png';
    }

    /**
     * Draws the complete boss health bar on canvas
     * @function draw
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    draw(ctx) {
        this.drawBossHealthBarBackground(ctx);
        this.drawBossHealthBar(ctx);
    }

    /**
     * Draws the boss health bar background image
     * @function drawBossHealthBarBackground
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    drawBossHealthBarBackground(ctx) {
        if (this.bossHealthBarImage && this.bossHealthBarImage.complete) {
            ctx.drawImage(this.bossHealthBarImage, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Draws the boss health bar with current health percentage
     * @function drawBossHealthBar
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    drawBossHealthBar(ctx) {
        let barX = this.x + 39;
        let barY = this.y + 13;
        let barWidth = 75;
        let barHeight = 15;

        ctx.fillStyle = 'rgba(50, 0, 0, 0.8)';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        let currentBarWidth = (barWidth * this.percentage) / 100;
        ctx.fillStyle = '#d32f2f';
        ctx.fillRect(barX, barY, currentBarWidth, barHeight);

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}
