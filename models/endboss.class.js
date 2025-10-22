class Endboss extends MovableObject {
    // Position and Size
    y = 100;
    height = 400;
    width = 350;

    // Collision Box (angepasst an tatsächlichen Körper - zentriert)
    collisionOffsetX = 100;
    collisionOffsetY = 70;
    collisionWidth = 150;
    collisionHeight = 210;

    // Idle Animation Properties
    idleImage;
    currentIdleFrame = 0;
    idleSpriteWidth = 176;
    idleSpriteHeight = 144;
    idleFrameCount = 13;
    idleDisplayWidth = 350;
    idleDisplayHeight = 350;
    idleAnimationSpeed = 80;
    lastIdleFrameTime = Date.now();

    // Walk Animation Properties
    walkImage;
    currentWalkFrame = 0;
    walkSpriteWidth = 176;
    walkSpriteHeight = 144;
    walkFrameCount = 10;
    walkDisplayWidth = 350;
    walkDisplayHeight = 350;
    walkAnimationSpeed = 60;
    lastWalkFrameTime = Date.now();

    // State
    isWalking = false;

    constructor(){
        super();
        this.loadIdleImage('./assets/werwolf boss/Idle.png');
        this.loadWalkImage('./assets/werwolf boss/Walk.png');
        this.x = 1900; // Endboss am Ende des Levels platziert (bei level_end_x = 2200)
        this.animate();
    }

    loadIdleImage(path) {
        this.idleImage = new Image();
        this.idleImage.src = path;
    }

    loadWalkImage(path) {
        this.walkImage = new Image();
        this.walkImage.src = path;
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

    updateWalkAnimation() {
        let now = Date.now();
        if (now - this.lastWalkFrameTime > this.walkAnimationSpeed) {
            this.currentWalkFrame++;
            if (this.currentWalkFrame >= this.walkFrameCount) {
                this.currentWalkFrame = 0;
            }
            this.lastWalkFrameTime = now;
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

    drawWalkSprite(ctx) {
        let frameX = this.currentWalkFrame * this.walkSpriteWidth;
        this.drawSprite(ctx, this.walkImage, frameX,
            this.walkSpriteWidth, this.walkSpriteHeight,
            this.walkDisplayWidth, this.walkDisplayHeight);
    }

    animate() {
        // Animation updates (60 FPS for smoother animations)
        setInterval(() => {
            this.updateIdleAnimation();
            this.updateWalkAnimation();
        }, 1000 / 60);
    }

    // Debug: Draw collision frame
    drawFrame(ctx) {
        if (!CONFIG.SHOW_COLLISION_BOXES) return;

        // Collision box (gelb)
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