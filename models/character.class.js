class Character extends MovableObject {
    // Character Properties
    width = 200;
    height = 200;
    y = 225;
    speed = 3;
    world;

    // Health System
    maxHP = 100;
    currentHP = 100;
    isDead = false;

    // Collision Box (angepasst an tatsächlichen Körper - zentriert)
    collisionOffsetX = 60;
    collisionOffsetY = 90;
    collisionWidth = 80;
    collisionHeight = 115;

    // Knockback Properties
    isKnockedBack = false;
    knockbackForce = 0;
    knockbackDirection = 1; // 1 = rechts, -1 = links
    invulnerable = false;
    invulnerableTime = 1000; // 1 Sekunde Unverwundbarkeit
    lastHitTime = 0;

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
    isRunning = false;

    // Walk
    walkImage;
    currentWalkFrame = 0;
    walkFrameWidth = 128;
    walkFrameHeight = 128;
    walkframeCount = 7;
    walkFrameCount = 0;
    walkAnimationSpeed = 150;
    lastWalkFrameTime= Date.now();
    walkDisplayWidth = 200;
    walkDisplayHeight = 200;

    // Jump
    jumpImage;
    currentJumpFrame = 3;
    jumpFrameWidth = 128;
    jumpFrameHeight = 128;
    jumpFrameCount = 8;
    jumpAnimationSpeed = 200;
    lastJumpFrameTime = Date.now();
    jumpDisplayWidth = 200;
    jumpDisplayHeight = 200;

    // Run
    runImage;
    currentRunFrame = 0;
    runFrameWidth = 128;
    runFrameHeight = 128;
    runFrameCount = 8;  // Anzahl der Frames im Run-Spritesheet
    runAnimationSpeed = 80;  // Schneller als Walk (80ms statt 100ms)
    lastRunFrameTime = Date.now();
    runDisplayWidth = 200;
    runDisplayHeight = 200;

    // Death
    deathImage;
    currentDeathFrame = 0;
    deathFrameWidth = 128;
    deathFrameHeight = 128;
    deathFrameCount = 4;
    deathDisplayWidth = 200;
    deathDisplayHeight = 200;
    deathAnimationSpeed = 150;
    lastDeathFrameTime = Date.now();
    deathAnimationFinished = false;


    constructor() {
        super();
        this.loadIdleImage('./assets/wizard_assets/Wanderer Magican/Idle.png');
        this.loadWalkImage('./assets/wizard_assets/Wanderer Magican/Walk.png');
        this.loadJumpImage('./assets/wizard_assets/Wanderer Magican/Jump.png');
        this.loadRunImage('./assets/wizard_assets/Wanderer Magican/Run.png');
        this.loadDeathImage('./assets/wizard_assets/Wanderer Magican/Dead.png');
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

    loadRunImage(path) {
        this.runImage = new Image();
        this.runImage.src = path;
    }

    loadDeathImage(path) {
        this.deathImage = new Image();
        this.deathImage.src = path;
    }

    // Update animations
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
            if (this.currentJumpFrame < 5) {  // Nur bis Frame 7 animieren
                this.currentJumpFrame++;
            }
            // stop at frame 7 - not other animations
            this.lastJumpFrameTime = now;
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

    updateDeathAnimation() {
        if (this.deathAnimationFinished) return;

        let now = Date.now();
        if (now - this.lastDeathFrameTime > this.deathAnimationSpeed) {
            this.currentDeathFrame++;
            if (this.currentDeathFrame >= this.deathFrameCount) {
                this.currentDeathFrame = this.deathFrameCount - 1; // Letzten Frame halten
                this.deathAnimationFinished = true;
            }
            this.lastDeathFrameTime = now;
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

    drawIdleSprite(ctx) {
        let frameX = this.currentIdleFrame * this.idleSpriteWidth;
        this.drawSprite(ctx, this.idleImage, frameX,
            this.idleSpriteWidth, this.idleSpriteHeight,
            this.idleDisplayWidth, this.idleDisplayHeight);
    }

    drawWalkSprite(ctx) {
        let frameX = this.currentWalkFrame * this.walkFrameWidth;
        this.drawSprite(ctx, this.walkImage, frameX,
            this.walkFrameWidth, this.walkFrameHeight,
            this.walkDisplayWidth, this.walkDisplayHeight);
    }

    drawJumpSprite(ctx) {
        let frameX = this.currentJumpFrame * this.jumpFrameWidth;
        this.drawSprite(ctx, this.jumpImage, frameX,
            this.jumpFrameWidth, this.jumpFrameHeight,
            this.jumpDisplayWidth, this.jumpDisplayHeight);
    }

    drawRunSprite(ctx) {
        let frameX = this.currentRunFrame * this.runFrameWidth;
        this.drawSprite(ctx, this.runImage, frameX,
            this.runFrameWidth, this.runFrameHeight,
            this.runDisplayWidth, this.runDisplayHeight);
    }

    drawDeathSprite(ctx) {
        let frameX = this.currentDeathFrame * this.deathFrameWidth;
        this.drawSprite(ctx, this.deathImage, frameX,
            this.deathFrameWidth, this.deathFrameHeight,
            this.deathDisplayWidth, this.deathDisplayHeight);
    }

    animate() {
        // Movement and controls (60 FPS)
        setInterval(() => {
            this.updateKnockback();
            this.handleMovement();
            this.updateCamera();
        }, 1000 / 60);

        // Animation updates (10 FPS)
        setInterval(() => {
            this.updateIdleAnimation();
            this.updateWalkAnimation();
            this.updateJumpAnimation();
            this.updateRunAnimation();
            this.updateDeathAnimation();
        }, 100);
    }

    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.currentDeathFrame = 0;
        this.deathAnimationFinished = false;
        console.log('Character died!');
    }

handleMovement() {
    if (!this.world) return;

    // Blockiere Bewegung wenn Character tot ist
    if (this.isDead) return;

    // Checken ob irgendwas gedrückt wird
    let isMoving = false;
    let isRunning = false;

    // Check if Shift is pressed for running
    if (this.world.keyboard.SHIFT) {
        isRunning = true;
    }

    // Move right
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        let moveSpeed = isRunning ? this.speed * 2 : this.speed; // Doppelte Geschwindigkeit beim Rennen
        this.x += moveSpeed;
        this.otherDirection = false;
        isMoving = true;
    }

    // Move left  
    if (this.world.keyboard.LEFT && this.x > this.world.level.level_start_x) {
        let moveSpeed = isRunning ? this.speed * 2 : this.speed; // Doppelte Geschwindigkeit beim Rennen
        this.x -= moveSpeed;
        this.otherDirection = true;
        isMoving = true;
    }

    // Jump (Space or Up arrow)
    if (this.world.keyboard.SPACE || this.world.keyboard.UP) {
        this.jump();
        isMoving = true;
    }

    // Setze Status
    this.isIdle = !isMoving && !this.isAboveGround();
    this.isRunning = isRunning && isMoving && !this.isAboveGround();
}

    updateCamera() {
        if (this.world) {
            this.world.camera_x = -this.x + 100;
        }
    }

    jump() {
        if (!this.isAboveGround()) {
            this.speedY = 15;   // Jump force upward
            this.currentJumpFrame = 3;  // start at frame 3
        }
    }

    // Knockback bei Kollision
    applyKnockback(enemyX, damage) {
        if (this.invulnerable || this.isDead) return;

        // Schaden zufügen
        this.takeDamage(damage);

        this.isKnockedBack = true;
        this.invulnerable = true;
        this.lastHitTime = Date.now();

        // Bestimme Knockback-Richtung basierend auf Enemy-Position
        if (this.x < enemyX) {
            this.knockbackDirection = -1; // Nach links
        } else {
            this.knockbackDirection = 1; // Nach rechts
        }

        this.knockbackForce = 15;
        this.speedY = 10; // Kleiner Sprung nach oben

        // Knockback-Effekt nach 300ms beenden
        setTimeout(() => {
            this.isKnockedBack = false;
            this.knockbackForce = 0;
        }, 300);

        // Unverwundbarkeit nach 1 Sekunde beenden
        setTimeout(() => {
            this.invulnerable = false;
        }, this.invulnerableTime);
    }

    updateKnockback() {
        if (this.isKnockedBack && this.knockbackForce > 0) {
            this.x += this.knockbackDirection * this.knockbackForce;
            this.knockbackForce *= 0.85; // Abbremsen
        }
    }

    // Debug: Draw collision frame
    drawFrame(ctx) {
        if (!CONFIG.SHOW_COLLISION_BOXES) return;

        // Collision box (rot)
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.rect(
            this.x + this.collisionOffsetX,
            this.y + this.collisionOffsetY,
            this.collisionWidth,
            this.collisionHeight
        );
        ctx.stroke();
    }
}