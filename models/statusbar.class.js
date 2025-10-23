class StatusBar {
    x = 20;
    y = 10;
    width = 250;
    height = 125;
    percentage = 100;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    setPercentage(percentage) {
        this.percentage = percentage;
    }

    draw(ctx) {
        // Wird in Subklassen überschrieben
    }
}
