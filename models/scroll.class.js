class Scroll extends MovableObject {
    width = 40;
    height = 40;

    // Collision Box
    collisionOffsetX = 5;
    collisionOffsetY = 5;
    collisionWidth = 30;
    collisionHeight = 30;

    // Collectible Properties
    healthRestore = 20; // Gibt 20 HP zurück
    manaRestore = 20;   // Gibt 20 Mana zurück
    collected = false;

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage('./assets/collectibles/scroll.png');
    }

    // Debug: Draw collision frame
    drawFrame(ctx) {
        if (!CONFIG.SHOW_COLLISION_BOXES) return;

        // Collision box (grün für Collectibles)
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
