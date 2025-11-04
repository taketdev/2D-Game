class HealthBar extends StatusBar {
    hudPanelImage;

    /**
     * Initializes a new health bar with position and HUD panel
     * @function constructor
     * @param {number} x - X position of the health bar
     * @param {number} y - Y position of the health bar
     * @returns {void}
     */
    constructor(x, y) {
        super(x, y);
        this.loadHudPanel();
    }

    /**
     * Loads the HUD panel background image
     * @function loadHudPanel
     * @returns {void}
     */
    loadHudPanel() {
        this.hudPanelImage = new Image();
        this.hudPanelImage.src = './assets/hud/hudPaneltry2.png';
    }

    /**
     * Draws the complete health bar on canvas
     * @function draw
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    draw(ctx) {
        this.drawHudPanel(ctx);
        this.drawHealthBar(ctx);
    }

    /**
     * Draws the HUD panel background image
     * @function drawHudPanel
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    drawHudPanel(ctx) {
        if (this.hudPanelImage && this.hudPanelImage.complete) {
            ctx.drawImage(this.hudPanelImage, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Draws the health bar with current health percentage
     * @function drawHealthBar
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    drawHealthBar(ctx) {
        let barX = this.x + 93;
        let barY = this.y + 32;
        let barWidth = 110;
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
