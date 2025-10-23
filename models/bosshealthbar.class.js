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
        // Zeichne Boss Health Bar Hintergrund
        if (this.bossHealthBarImage && this.bossHealthBarImage.complete) {
            ctx.drawImage(this.bossHealthBarImage, this.x, this.y, this.width, this.height);
        }

        // Zeichne Health Bar (roter Balken)
        let barX = this.x + 39;
        let barY = this.y + 13;
        let barWidth = 75;
        let barHeight = 15;

        // Hintergrund (dunkelrot/schwarz)
        ctx.fillStyle = 'rgba(50, 0, 0, 0.8)';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Aktueller Health Balken (rot)
        let currentBarWidth = (barWidth * this.percentage) / 100;
        ctx.fillStyle = '#d32f2f'; // Rot
        ctx.fillRect(barX, barY, currentBarWidth, barHeight);

        // Rahmen
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}
