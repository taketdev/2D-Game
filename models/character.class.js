class Character extends MovableObject {
    // Character Properties
    height = 200;
    y = 225; 
    speed = 10;
    world;
    // Idle
    idleFrame;
    currentIdleFrame = 1;
    idleSpriteWidth = 128;   
    idleSpriteHeight = 128;  
    idleDisplayWidth = 200;  
    idleDisplayHeight = 200; 
    idleAnimationSpeed = 200;
    lastIdleFrameTime = Date.now();
    isIdle = true;

    // Walk
    walkImage;
    currentWalkFrame = 0;
    walkFrameWidth = 128;
    walkFrameHeight = 128;
    walkframeCount = 7;
    walkFrameCount = 0;
    walkAnimationSpeed = 100;
    lastWalkFrameTime= Date.now();
    walkDisplayWidth = 200;
    walkDisplayHeight = 200;

    // Jump
    jumpImage;
    currentJumpFrame = 0;
    jumpFrameWidth = 128;
    jumpFrameHeight = 128;
    jumpFrameCount = 8;
    jumpAnimationSpeed = 200;
    lastJumpFrameTime = Date.now();
    jumpDisplayWidth = 200;
    jumpDisplayHeight = 200;



    constructor() {
        super();
        this.loadIdleImage('./assets/wizard_assets/Wanderer Magican/Idle.png');
        this.loadWalkImage('./assets/wizard_assets/Wanderer Magican/Walk.png'); // Spritesheet für Walk
        this.loadJumpImage('./assets/wizard_assets/Wanderer Magican/Jump.png');
        this.animate();
        this.applyGravity();
    }

    loadIdleImage(path) {
        this.idleImage = new Image();
        this.idleImage.src = path;
    }

    loadWalkImage(path) {
        this.walkImage = new Image();
        this.walkImage.src = path;
    }

    loadJumpImage(path) {
        this.jumpImage = new Image();
        this.jumpImage.src = path;
    }

    // Update Idle Animation
    updateIdleAnimation() {
        let now = Date.now();
        if (now - this.lastIdleFrameTime > this.idleAnimationSpeed) {
            this.currentIdleFrame++;
            if (this.currentIdleFrame > 7) {
                this.currentIdleFrame = 1;
            }
            this.lastIdleFrameTime = now;
        }
    }

    updateWalkAnimation() {
        let now = Date.now();
        if (now - this.lastWalkFrameTime > this.walkAnimationSpeed) {
            this.currentWalkFrame++;
            if (this.currentWalkFrame >= this.walkframeCount) {
                this.currentWalkFrame = 0;
            }
            this.lastWalkFrameTime = now;
        }
    }

    updateJumpAnimation() {
        let now = Date.now();
        if (now - this.lastJumpFrameTime > this.jumpAnimationSpeed) {
            this.currentJumpFrame++;
            if (this.currentJumpFrame >= this.jumpFrameCount) {
                this.currentJumpFrame = 0;
            }
            this.lastJumpFrameTime = now;
        }
    }

    drawSprite(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight) {
        if (!image || !image.complete) return;

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
    }

    drawIdleSprite(ctx, x, y) {
        let frameX = this.currentIdleFrame * this.idleSpriteWidth;
        this.drawSprite(ctx, thisidleImage, frameX,
            this.idleSpriteWidth, this.idleSpriteHeight,
            this.idleDisplayWidth, this.idleDisplayHeight);
    }

    drawWalkSprite(ctx, x, y) {
        let frameX = this.currentWalkFrame * this.walkFrameWidth;
        this.drawSprite(ctx, this.walkImage, framceX,
            this.walkFrameWidth, this.walkFrameHeight,
            this.walkDisplayWidth, this.walkDisplayHeight);
    }

    drawJumpSprite(ctx, x, y) {
        let frameX = this.currentJumpFrame * this.walkFrameWidth;
        this.drawSprite(ctx, this.jumpImage, frameX,
            this.jumpFrameWidth, this.jumpFrameHeight,
            this.jumpDisplayWidth, this.jumpDisplayHeight);
    }

    animate() {
        // Movement and controls (60 FPS)
        setInterval(() => {
            this.handleMovement();
            this.updateCamera();
        }, 1000 / 60);

        // Animation updates (10 FPS)
        setInterval(() => {
            this.handleAnimations();
            this.updateIdleAnimation();
            this.updateWalkAnimation();
            this.updateJumpAnimation();
        }, 100);
    }

handleMovement() {
    if (!this.world) return;

    // Checken ob irgendwas gedrückt wird
    let isMoving = false;

    // Move right
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.x += this.speed;
        this.otherDirection = false;
        isMoving = true;
    }

    // Move left  
    if (this.world.keyboard.LEFT && this.x > this.world.level.level_start_x) {
        this.x -= this.speed;
        this.otherDirection = true;
        isMoving = true;
    }

    // Jump (Space or Up arrow)
    if (this.world.keyboard.SPACE || this.world.keyboard.UP) {
        this.jump();
        isMoving = true;
    }

    // Setze idle Status
    this.isIdle = !isMoving && !this.isAboveGround();
}

    handleAnimations() {
        // Wir machen hier nichts mehr, da wir jetzt Spritesheets verwenden
        // Die Animation-Updates laufen über updateIdleAnimation() und updateWalkAnimation()
    }

    updateCamera() {
        if (this.world) {
            this.world.camera_x = -this.x + 100;
        }
    }

    jump() {
        if (!this.isAboveGround()) { 
            this.speedY = 20;   // Jump force upward
            this.currentJumpFrame = 0;
        }
    }
}