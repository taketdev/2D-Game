class ManaBar extends StatusBar {
    constructor(x, y) {
        super(x, y);
    }

    draw(ctx) {
        // Zeichne Mana Bar (blauer Balken, unter Health Bar)
        // Position angepasst an das HUD Panel
        let barX = this.x + 93; // Rechts vom dunklen Viereck (gleiche X-Position wie Health Bar)
        let barY = this.y + 70; // Unterer Balken (unter Health Bar)
        let barWidth = 110;
        let barHeight = 15;

        // Hintergrund (dunkelblau/schwarz)
        ctx.fillStyle = 'rgba(0, 0, 50, 0.8)';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Aktueller Mana Balken (blau)
        let currentBarWidth = (barWidth * this.percentage) / 100;
        ctx.fillStyle = '#1976d2'; // Blau
        ctx.fillRect(barX, barY, currentBarWidth, barHeight);

        // Rahmen
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}
