/**
 * Character Animation System
 * Contains all animation update and sprite drawing functions
 */

/**
 * Updates idle animation frame cycling
 * @function updateIdleAnimation
 * @returns {void}
 */
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

/**
 * Updates walking animation frame cycling
 * @function updateWalkAnimation
 * @returns {void}
 */
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

/**
 * Updates jump animation frame cycling with limited frame count
 * @function updateJumpAnimation
 * @returns {void}
 */
Character.prototype.updateJumpAnimation = function() {
    let now = Date.now();
    if (now - this.lastJumpFrameTime > this.jumpAnimationSpeed) {
        if (this.currentJumpFrame < 5) {
            this.currentJumpFrame++;
        }
        this.lastJumpFrameTime = now;
    }
};

/**
 * Updates running animation frame cycling
 * @function updateRunAnimation
 * @returns {void}
 */
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

/**
 * Updates hurt animation and manages hurt state
 * @function updateHurtAnimation
 * @returns {void}
 */
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

/**
 * Updates death animation and manages completion state
 * @function updateDeathAnimation
 * @returns {void}
 */
Character.prototype.updateDeathAnimation = function() {
    if (this.deathAnimationFinished) return;

    let now = Date.now();
    if (now - this.lastDeathFrameTime > this.deathAnimationSpeed) {
        this.currentDeathFrame++;
        if (this.currentDeathFrame >= this.deathFrameCount) {
            this.currentDeathFrame = this.deathFrameCount - 1;
            this.deathAnimationFinished = true;
        }
        this.lastDeathFrameTime = now;
    }
};

/**
 * Updates attack 1 animation and handles projectile spawning
 * @function updateAttack1Animation
 * @returns {void}
 */
Character.prototype.updateAttack1Animation = function() {
    if (!this.isAttacking1) return;
    let now = Date.now();
    if (now - this.lastAttack1FrameTime > this.attack1AnimationSpeed) {
        this.currentAttack1Frame++;
        this.checkAttack1Projectile();
        this.checkAttack1Complete();
        this.lastAttack1FrameTime = now;
    }
};

/**
 * Checks and spawns attack 1 projectile at the right frame
 * @function checkAttack1Projectile
 * @returns {void}
 */
Character.prototype.checkAttack1Projectile = function() {
    if (this.currentAttack1Frame === 3 && !this.attack1ProjectileSpawned) {
        this.spawnProjectile(1);
        this.attack1ProjectileSpawned = true;
    }
};

/**
 * Checks if attack 1 animation is complete and resets state
 * @function checkAttack1Complete
 * @returns {void}
 */
Character.prototype.checkAttack1Complete = function() {
    if (this.currentAttack1Frame >= this.attack1FrameCount) {
        this.isAttacking1 = false;
        this.currentAttack1Frame = 0;
        this.attack1ProjectileSpawned = false;
    }
};

/**
 * Updates attack 2 animation and handles projectile spawning
 * @function updateAttack2Animation
 * @returns {void}
 */
Character.prototype.updateAttack2Animation = function() {
    if (!this.isAttacking2) return;
    let now = Date.now();
    if (now - this.lastAttack2FrameTime > this.attack2AnimationSpeed) {
        this.currentAttack2Frame++;
        this.checkAttack2Projectile();
        this.checkAttack2Complete();
        this.lastAttack2FrameTime = now;
    }
};

/**
 * Checks and spawns attack 2 projectile at the right frame
 * @function checkAttack2Projectile
 * @returns {void}
 */
Character.prototype.checkAttack2Projectile = function() {
    if (this.currentAttack2Frame === 6 && !this.attack2ProjectileSpawned) {
        this.spawnProjectile(2);
        this.attack2ProjectileSpawned = true;
    }
};

/**
 * Checks if attack 2 animation is complete and resets state
 * @function checkAttack2Complete
 * @returns {void}
 */
Character.prototype.checkAttack2Complete = function() {
    if (this.currentAttack2Frame >= this.attack2FrameCount) {
        this.isAttacking2 = false;
        this.currentAttack2Frame = 0;
        this.attack2ProjectileSpawned = false;
    }
};

/**
 * Draws a sprite with optional direction flipping
 * @function drawSprite
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @param {HTMLImageElement} image - Image to draw
 * @param {number} frameX - X position of frame in sprite sheet
 * @param {number} frameWidth - Width of single frame
 * @param {number} frameHeight - Height of single frame
 * @param {number} displayWidth - Display width on canvas
 * @param {number} displayHeight - Display height on canvas
 * @returns {void}
 */
Character.prototype.drawSprite = function(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight) {
    if (!image || !image.complete) return;
    if (this.otherDirection) {
        this.drawFlippedSprite(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight);
    } else {
        this.drawNormalSprite(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight);
    }
};

/**
 * Draws sprite flipped horizontally
 * @function drawFlippedSprite
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @param {HTMLImageElement} image - Image to draw
 * @param {number} frameX - X position of frame in sprite sheet
 * @param {number} frameWidth - Width of single frame
 * @param {number} frameHeight - Height of single frame
 * @param {number} displayWidth - Display width on canvas
 * @param {number} displayHeight - Display height on canvas
 * @returns {void}
 */
Character.prototype.drawFlippedSprite = function(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight) {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(image, frameX, 0, frameWidth, frameHeight, -this.x - displayWidth, this.y, displayWidth, displayHeight);
    ctx.restore();
};

/**
 * Draws sprite in normal direction
 * @function drawNormalSprite
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @param {HTMLImageElement} image - Image to draw
 * @param {number} frameX - X position of frame in sprite sheet
 * @param {number} frameWidth - Width of single frame
 * @param {number} frameHeight - Height of single frame
 * @param {number} displayWidth - Display width on canvas
 * @param {number} displayHeight - Display height on canvas
 * @returns {void}
 */
Character.prototype.drawNormalSprite = function(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight) {
    ctx.drawImage(image, frameX, 0, frameWidth, frameHeight, this.x, this.y, displayWidth, displayHeight);
};

/**
 * Draws idle animation sprite
 * @function drawIdleSprite
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @returns {void}
 */
Character.prototype.drawIdleSprite = function(ctx) {
    let frameX = this.currentIdleFrame * this.idleSpriteWidth;
    this.drawSprite(ctx, this.idleImage, frameX,
        this.idleSpriteWidth, this.idleSpriteHeight,
        this.idleDisplayWidth, this.idleDisplayHeight);
};

/**
 * Draws walking animation sprite
 * @function drawWalkSprite
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @returns {void}
 */
Character.prototype.drawWalkSprite = function(ctx) {
    let frameX = this.currentWalkFrame * this.walkFrameWidth;
    this.drawSprite(ctx, this.walkImage, frameX,
        this.walkFrameWidth, this.walkFrameHeight,
        this.walkDisplayWidth, this.walkDisplayHeight);
};

/**
 * Draws jumping animation sprite
 * @function drawJumpSprite
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @returns {void}
 */
Character.prototype.drawJumpSprite = function(ctx) {
    let frameX = this.currentJumpFrame * this.jumpFrameWidth;
    this.drawSprite(ctx, this.jumpImage, frameX,
        this.jumpFrameWidth, this.jumpFrameHeight,
        this.jumpDisplayWidth, this.jumpDisplayHeight);
};

/**
 * Draws running animation sprite
 * @function drawRunSprite
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @returns {void}
 */
Character.prototype.drawRunSprite = function(ctx) {
    let frameX = this.currentRunFrame * this.runFrameWidth;
    this.drawSprite(ctx, this.runImage, frameX,
        this.runFrameWidth, this.runFrameHeight,
        this.runDisplayWidth, this.runDisplayHeight);
};

/**
 * Draws hurt animation sprite
 * @function drawHurtSprite
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @returns {void}
 */
Character.prototype.drawHurtSprite = function(ctx) {
    let frameX = this.currentHurtFrame * this.hurtFrameWidth;
    this.drawSprite(ctx, this.hurtImage, frameX,
        this.hurtFrameWidth, this.hurtFrameHeight,
        this.hurtDisplayWidth, this.hurtDisplayHeight);
};

/**
 * Draws death animation sprite
 * @function drawDeathSprite
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @returns {void}
 */
Character.prototype.drawDeathSprite = function(ctx) {
    let frameX = this.currentDeathFrame * this.deathFrameWidth;
    this.drawSprite(ctx, this.deathImage, frameX,
        this.deathFrameWidth, this.deathFrameHeight,
        this.deathDisplayWidth, this.deathDisplayHeight);
};

/**
 * Draws attack 1 animation sprite
 * @function drawAttack1Sprite
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @returns {void}
 */
Character.prototype.drawAttack1Sprite = function(ctx) {
    let frameX = this.currentAttack1Frame * this.attack1FrameWidth;
    this.drawSprite(ctx, this.attack1Image, frameX,
        this.attack1FrameWidth, this.attack1FrameHeight,
        this.attack1DisplayWidth, this.attack1DisplayHeight);
};

/**
 * Draws attack 2 animation sprite
 * @function drawAttack2Sprite
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @returns {void}
 */
Character.prototype.drawAttack2Sprite = function(ctx) {
    let frameX = this.currentAttack2Frame * this.attack2FrameWidth;
    this.drawSprite(ctx, this.attack2Image, frameX,
        this.attack2FrameWidth, this.attack2FrameHeight,
        this.attack2DisplayWidth, this.attack2DisplayHeight);
};

/**
 * Starts the animation loop that updates all character animations
 * @function startAnimationLoop
 * @returns {void}
 */
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
