class Projectile extends MovableObject {
    // Projectile Properties
    width = 80;
    height = 80;
    speed = 8;
    damage = 0;
    projectileType = 1; // 1 = Charge_1 (Attack 1), 2 = Charge_2 (Attack 2)

    // Animation Properties
    currentFrame = 0;
    frameWidth = 64; // Charge Spritesheets haben 64px pro Frame
    frameHeight = 128;
    frameCount = 8; // Wird im Konstruktor gesetzt
    animationSpeed = 80;
    lastFrameTime = Date.now();

    // Collision Box
    collisionOffsetX = 20;
    collisionOffsetY = 20;
    collisionWidth = 40;
    collisionHeight = 40;

    // Lifecycle
    hasHit = false;
    markedForDeletion = false;

    constructor(x, y, direction, projectileType, damage) {
        super();
        this.x = x;
        this.y = y;
        this.otherDirection = direction < 0; // true wenn nach links
        this.projectileType = projectileType;
        this.damage = damage;

        // Lade das richtige Spritesheet mit korrekten Frame-Counts
        if (projectileType === 1) {
            // Charge_1: 576×128 = 9 Frames → in JS 0-8
            this.loadProjectileImage('./assets/wizard_assets/Wanderer Magican/Charge_1.png');
            this.frameCount = 9;
            this.frameWidth = 64; // 576 / 9 = 64
        } else if (projectileType === 2) {
            // Charge_2: 384×128 = 6 Frames → in JS 0-5
            this.loadProjectileImage('./assets/wizard_assets/Wanderer Magican/Charge_2.png');
            this.frameCount = 6;
            this.frameWidth = 64; // 384 / 6 = 64
        }

        this.animate();
    }

    loadProjectileImage(path) {
        this.projectileImage = new Image();
        this.projectileImage.src = path;
    }

    animate() {
        setInterval(() => {
            this.updateAnimation();
            this.move();
        }, 1000 / 60);
    }

    updateAnimation() {
        let now = Date.now();
        if (now - this.lastFrameTime > this.animationSpeed) {
            this.currentFrame++;
            if (this.currentFrame >= this.frameCount) {
                this.currentFrame = 0;
            }
            this.lastFrameTime = now;
        }
    }

    move() {
        if (this.hasHit) return;

        // Bewege Projektil horizontal
        if (this.otherDirection) {
            this.x -= this.speed; // Nach links
        } else {
            this.x += this.speed; // Nach rechts
        }

        // Markiere zum Löschen wenn außerhalb des Bildschirms
        // Level-Ende ist bei x=5760 (8 * 720), also erweitere die Grenze
        if (this.x < -200 || this.x > 6000) {
            this.markedForDeletion = true;
        }
    }

    drawProjectileSprite(ctx) {
        if (!this.projectileImage || !this.projectileImage.complete) return;

        let frameX = this.currentFrame * this.frameWidth;

        if (this.otherDirection) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.projectileImage,
                frameX, 0,
                this.frameWidth, this.frameHeight,
                -this.x - this.width, this.y,
                this.width, this.height
            );
            ctx.restore();
        } else {
            ctx.drawImage(
                this.projectileImage,
                frameX, 0,
                this.frameWidth, this.frameHeight,
                this.x, this.y,
                this.width, this.height
            );
        }
    }

    hit() {
        this.hasHit = true;
        this.markedForDeletion = true;
    }

    // Debug: Draw collision frame
    drawFrame(ctx) {
        if (!CONFIG.SHOW_COLLISION_BOXES) return;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'yellow';
        ctx.rect(
            this.x + this.collisionOffsetX,
            this.y + this.collisionOffsetY,
            this.collisionWidth,
            this.collisionHeight
        );
        ctx.stroke();
    }
}
