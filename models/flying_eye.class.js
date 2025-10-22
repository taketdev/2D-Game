class FlyingEye extends MovableObject {
    // Position and Size (höher als Goblin, da fliegend)
    y = 50;
    height = 250;
    width = 250;

    // Collision Box (angepasst an tatsächlichen Körper - zentriert)
    collisionOffsetX = 85;
    collisionOffsetY = 90;
    collisionWidth = 70;
    collisionHeight = 70;

    // Flight Animation Properties
    flightImage;
    currentFlightFrame = 0;
    flightSpriteWidth = 150;
    flightSpriteHeight = 150;
    flightFrameCount = 8;
    flightDisplayWidth = 250;
    flightDisplayHeight = 250;
    flightAnimationSpeed = 80;
    lastFlightFrameTime = Date.now();

    constructor() {
        super();
        this.loadFlightImage('./assets/monsters/Flying eye/Flight.png');

        // Random position and speed (langsamer, angepasst an Character)
        this.x = 300 + Math.random() * 600;
        this.speed = 0.6 + Math.random() * 0.6;
        this.otherDirection = true; // Sprite spiegeln, damit er richtig herum fliegt

        this.animate();
        this.moveLeft();
    }

    loadFlightImage(path) {
        this.flightImage = new Image();
        this.flightImage.src = path;
    }

    updateFlightAnimation() {
        let now = Date.now();
        if (now - this.lastFlightFrameTime > this.flightAnimationSpeed) {
            this.currentFlightFrame++;
            if (this.currentFlightFrame >= this.flightFrameCount) {
                this.currentFlightFrame = 0;
            }
            this.lastFlightFrameTime = now;
        }
    }

    drawSprite(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight) {
        if (!image || !image.complete) return;

        // Disable image smoothing for crisp pixel art
        ctx.imageSmoothingEnabled = false;

        if (this.otherDirection) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(
                image,
                frameX, 0,
                frameWidth, frameHeight,
                -this.x - displayWidth, this.y,
                displayWidth, displayHeight
            );
            ctx.restore();
        } else {
            ctx.drawImage(
                image,
                frameX, 0,
                frameWidth, frameHeight,
                this.x, this.y,
                displayWidth, displayHeight
            );
        }

        // Re-enable image smoothing for other objects
        ctx.imageSmoothingEnabled = true;
    }

    drawFlightSprite(ctx) {
        let frameX = this.currentFlightFrame * this.flightSpriteWidth;
        this.drawSprite(ctx, this.flightImage, frameX,
            this.flightSpriteWidth, this.flightSpriteHeight,
            this.flightDisplayWidth, this.flightDisplayHeight);
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }

    animate() {
        // Animation updates (60 FPS for smoother animations)
        setInterval(() => {
            this.updateFlightAnimation();
        }, 1000 / 60);
    }

    // Debug: Draw collision frame
    drawFrame(ctx) {
        if (!CONFIG.SHOW_COLLISION_BOXES) return;

        // Collision box (cyan)
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'cyan';
        ctx.rect(
            this.x + this.collisionOffsetX,
            this.y + this.collisionOffsetY,
            this.collisionWidth,
            this.collisionHeight
        );
        ctx.stroke();
    }
}
