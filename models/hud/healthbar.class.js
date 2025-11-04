class HealthBar extends StatusBar {
    hudPanelImage;

    constructor(x, y) {
        super(x, y);
        this.loadHudPanel();
    }

    loadHudPanel() {
        this.hudPanelImage = new Image();
        this.hudPanelImage.src = './assets/hud/hudPaneltry2.png';
    }

    draw(ctx) {
        this.drawHudPanel(ctx);
        this.drawHealthBar(ctx);
    }

    drawHudPanel(ctx) {
        if (this.hudPanelImage && this.hudPanelImage.complete) {
            ctx.drawImage(this.hudPanelImage, this.x, this.y, this.width, this.height);
        }
    }

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
