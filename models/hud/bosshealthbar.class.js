class BossHealthBar extends StatusBar {
    bossHealthBarImage;

    constructor(x, y) {
        super(x, y);
        this.width = 120;
        this.height = 41;
        this.loadBossHealthBarImage();
    }

    loadBossHealthBarImage() {
        this.bossHealthBarImage = new Image();
        this.bossHealthBarImage.src = './assets/hud/bossHealthBar.png';
    }

    draw(ctx) {
        this.drawBossHealthBarBackground(ctx);
        this.drawBossHealthBar(ctx);
    }

    drawBossHealthBarBackground(ctx) {
        if (this.bossHealthBarImage && this.bossHealthBarImage.complete) {
            ctx.drawImage(this.bossHealthBarImage, this.x, this.y, this.width, this.height);
        }
    }

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
