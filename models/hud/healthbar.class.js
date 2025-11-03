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
        // Zeichne HUD Panel Hintergrund
        if (this.hudPanelImage && this.hudPanelImage.complete) {
            ctx.drawImage(this.hudPanelImage, this.x, this.y, this.width, this.height);
        }

        // Zeichne Health Bar (roter Balken)
        // Position angepasst an das HUD Panel
        let barX = this.x + 93; // Rechts vom dunklen Viereck
        let barY = this.y + 32; // Oberer Balken
        let barWidth = 110;
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
