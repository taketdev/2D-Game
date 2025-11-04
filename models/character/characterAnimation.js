/**
 * Character Animation System
 * Contains all animation update and sprite drawing functions
 */

// Animation Update Functions
Character.prototype.updateIdleAnimation = function() {
    let now = Date.now();
    if (now - this.lastIdleFrameTime > this.idleAnimationSpeed) {
        this.currentIdleFrame++;
        if (this.currentIdleFrame > 7) {
            this.currentIdleFrame = 1;
        }
        this.lastIdleFrameTime = now;
    }
};

Character.prototype.updateWalkAnimation = function() {
    let now = Date.now();
    if (now - this.lastWalkFrameTime > this.walkAnimationSpeed) {
        this.currentWalkFrame++;
        if (this.currentWalkFrame >= this.walkframeCount) {
            this.currentWalkFrame = 0;
        }
        this.lastWalkFrameTime = now;
    }
};

Character.prototype.updateJumpAnimation = function() {
    let now = Date.now();
    if (now - this.lastJumpFrameTime > this.jumpAnimationSpeed) {
        if (this.currentJumpFrame < 5) {  // Nur bis Frame 5 animieren
            this.currentJumpFrame++;
        }
        // stop at frame 7 - not other animations
        this.lastJumpFrameTime = now;
    }
};

Character.prototype.updateRunAnimation = function() {
    let now = Date.now();
    if (now - this.lastRunFrameTime > this.runAnimationSpeed) {
        this.currentRunFrame++;
        if (this.currentRunFrame >= this.runFrameCount) {
            this.currentRunFrame = 0;
        }
        this.lastRunFrameTime = now;
    }
};

Character.prototype.updateHurtAnimation = function() {
    if (!this.isHurt) return;

    let now = Date.now();
    if (now - this.lastHurtFrameTime > this.hurtAnimationSpeed) {
        this.currentHurtFrame++;
        if (this.currentHurtFrame >= this.hurtFrameCount) {
            this.isHurt = false;
            this.currentHurtFrame = 0;
        }
        this.lastHurtFrameTime = now;
    }
};

Character.prototype.updateDeathAnimation = function() {
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
};

Character.prototype.updateAttack1Animation = function() {
    if (!this.isAttacking1) return;

    let now = Date.now();
    if (now - this.lastAttack1FrameTime > this.attack1AnimationSpeed) {
        this.currentAttack1Frame++;

        // Spawne Projektil bei Frame 3
        if (this.currentAttack1Frame === 3 && !this.attack1ProjectileSpawned) {
            this.spawnProjectile(1); // Typ 1 = Charge_1
            this.attack1ProjectileSpawned = true;
        }

        // Animation beenden
        if (this.currentAttack1Frame >= this.attack1FrameCount) {
            this.isAttacking1 = false;
            this.currentAttack1Frame = 0;
            this.attack1ProjectileSpawned = false;
        }
        this.lastAttack1FrameTime = now;
    }
};

Character.prototype.updateAttack2Animation = function() {
    if (!this.isAttacking2) return;

    let now = Date.now();
    if (now - this.lastAttack2FrameTime > this.attack2AnimationSpeed) {
        this.currentAttack2Frame++;

        // Spawne Projektil bei Frame 6
        if (this.currentAttack2Frame === 6 && !this.attack2ProjectileSpawned) {
            this.spawnProjectile(2); // Typ 2 = Charge_2
            this.attack2ProjectileSpawned = true;
        }

        // Animation beenden
        if (this.currentAttack2Frame >= this.attack2FrameCount) {
            this.isAttacking2 = false;
            this.currentAttack2Frame = 0;
            this.attack2ProjectileSpawned = false;
        }
        this.lastAttack2FrameTime = now;
    }
};

// Sprite Drawing Functions
Character.prototype.drawSprite = function(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight) {
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
};

Character.prototype.drawIdleSprite = function(ctx) {
    let frameX = this.currentIdleFrame * this.idleSpriteWidth;
    this.drawSprite(ctx, this.idleImage, frameX,
        this.idleSpriteWidth, this.idleSpriteHeight,
        this.idleDisplayWidth, this.idleDisplayHeight);
};

Character.prototype.drawWalkSprite = function(ctx) {
    let frameX = this.currentWalkFrame * this.walkFrameWidth;
    this.drawSprite(ctx, this.walkImage, frameX,
        this.walkFrameWidth, this.walkFrameHeight,
        this.walkDisplayWidth, this.walkDisplayHeight);
};

Character.prototype.drawJumpSprite = function(ctx) {
    let frameX = this.currentJumpFrame * this.jumpFrameWidth;
    this.drawSprite(ctx, this.jumpImage, frameX,
        this.jumpFrameWidth, this.jumpFrameHeight,
        this.jumpDisplayWidth, this.jumpDisplayHeight);
};

Character.prototype.drawRunSprite = function(ctx) {
    let frameX = this.currentRunFrame * this.runFrameWidth;
    this.drawSprite(ctx, this.runImage, frameX,
        this.runFrameWidth, this.runFrameHeight,
        this.runDisplayWidth, this.runDisplayHeight);
};

Character.prototype.drawHurtSprite = function(ctx) {
    let frameX = this.currentHurtFrame * this.hurtFrameWidth;
    this.drawSprite(ctx, this.hurtImage, frameX,
        this.hurtFrameWidth, this.hurtFrameHeight,
        this.hurtDisplayWidth, this.hurtDisplayHeight);
};

Character.prototype.drawDeathSprite = function(ctx) {
    let frameX = this.currentDeathFrame * this.deathFrameWidth;
    this.drawSprite(ctx, this.deathImage, frameX,
        this.deathFrameWidth, this.deathFrameHeight,
        this.deathDisplayWidth, this.deathDisplayHeight);
};

Character.prototype.drawAttack1Sprite = function(ctx) {
    let frameX = this.currentAttack1Frame * this.attack1FrameWidth;
    this.drawSprite(ctx, this.attack1Image, frameX,
        this.attack1FrameWidth, this.attack1FrameHeight,
        this.attack1DisplayWidth, this.attack1DisplayHeight);
};

Character.prototype.drawAttack2Sprite = function(ctx) {
    let frameX = this.currentAttack2Frame * this.attack2FrameWidth;
    this.drawSprite(ctx, this.attack2Image, frameX,
        this.attack2FrameWidth, this.attack2FrameHeight,
        this.attack2DisplayWidth, this.attack2DisplayHeight);
};

// Animation Loop Management
Character.prototype.startAnimationLoop = function() {
    this.animationIntervalId = setInterval(() => {
        if (this.world && this.world.isPaused) return;

        this.updateIdleAnimation();
        this.updateWalkAnimation();
        this.updateJumpAnimation();
        this.updateRunAnimation();
        this.updateHurtAnimation();
        this.updateDeathAnimation();
    }, 100);
};
