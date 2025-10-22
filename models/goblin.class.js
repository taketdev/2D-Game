class Goblin extends MovableObject {
    // Position and Size
    y = 250;
    height = 250;
    width = 250;

    // Collision Box (angepasst an tatsächlichen Körper - zentriert)
    collisionOffsetX = 90;
    collisionOffsetY = 100;
    collisionWidth = 65;
    collisionHeight = 70;

    // Idle Animation Properties
    idleImage;
    currentIdleFrame = 0;
    idleSpriteWidth = 150;
    idleSpriteHeight = 150;
    idleFrameCount = 4;
    idleDisplayWidth = 250;
    idleDisplayHeight = 250;
    idleAnimationSpeed = 150;
    lastIdleFrameTime = Date.now();

    // Run Animation Properties
    runImage;
    currentRunFrame = 0;
    runSpriteWidth = 150;
    runSpriteHeight = 150;
    runFrameCount = 8;
    runDisplayWidth = 250;
    runDisplayHeight = 250;
    runAnimationSpeed = 80;
    lastRunFrameTime = Date.now();

    // State
    isRunning = true;

    constructor() {
        super();
        this.loadIdleImage('./assets/monsters/Goblin/Idle.png');
        this.loadRunImage('./assets/monsters/Goblin/Run.png');

        // Random position and speed (langsamer, angepasst an Character)
        this.x = 200 + Math.random() * 500;
        this.speed = 0.5 + Math.random() * 0.5;
        this.otherDirection = true; // Sprite spiegeln, damit er richtig herum läuft

        this.animate();
        this.moveLeft();
    }

    loadIdleImage(path) {
        this.idleImage = new Image();
        this.idleImage.src = path;
    }

    loadRunImage(path) {
        this.runImage = new Image();
        this.runImage.src = path;
    }

    updateIdleAnimation() {
        let now = Date.now();
        if (now - this.lastIdleFrameTime > this.idleAnimationSpeed) {
            this.currentIdleFrame++;
            if (this.currentIdleFrame >= this.idleFrameCount) {
                this.currentIdleFrame = 0;
            }
            this.lastIdleFrameTime = now;
        }
    }

    updateRunAnimation() {
        let now = Date.now();
        if (now - this.lastRunFrameTime > this.runAnimationSpeed) {
            this.currentRunFrame++;
            if (this.currentRunFrame >= this.runFrameCount) {
                this.currentRunFrame = 0;
            }
            this.lastRunFrameTime = now;
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

    drawIdleSprite(ctx) {
        let frameX = this.currentIdleFrame * this.idleSpriteWidth;
        this.drawSprite(ctx, this.idleImage, frameX,
            this.idleSpriteWidth, this.idleSpriteHeight,
            this.idleDisplayWidth, this.idleDisplayHeight);
    }

    drawRunSprite(ctx) {
        let frameX = this.currentRunFrame * this.runSpriteWidth;
        this.drawSprite(ctx, this.runImage, frameX,
            this.runSpriteWidth, this.runSpriteHeight,
            this.runDisplayWidth, this.runDisplayHeight);
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }

    animate() {
        // Animation updates (60 FPS for smoother animations)
        setInterval(() => {
            this.updateIdleAnimation();
            this.updateRunAnimation();
        }, 1000 / 60);
    }

    // Debug: Draw collision frame
    drawFrame(ctx) {
        if (!CONFIG.SHOW_COLLISION_BOXES) return;

        // Collision box (blau)
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'blue';
        ctx.rect(
            this.x + this.collisionOffsetX,
            this.y + this.collisionOffsetY,
            this.collisionWidth,
            this.collisionHeight
        );
        ctx.stroke();
    }
}
