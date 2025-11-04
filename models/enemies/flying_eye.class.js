class FlyingEye extends MovableObject {
    y = 50;
    height = 250;
    width = 250;

    maxHP = 20;
    currentHP = 20;
    isDead = false;

    collisionOffsetX = 85;
    collisionOffsetY = 90;
    collisionWidth = 70;
    collisionHeight = 70;

    flightImage;
    currentFlightFrame = 0;
    flightSpriteWidth = 150;
    flightSpriteHeight = 150;
    flightFrameCount = 8;
    flightDisplayWidth = 250;
    flightDisplayHeight = 250;
    flightAnimationSpeed = 80;
    lastFlightFrameTime = Date.now();

    attackImage;
    currentAttackFrame = 0;
    attackSpriteWidth = 150;
    attackSpriteHeight = 150;
    attackFrameCount = 8;
    attackDisplayWidth = 250;
    attackDisplayHeight = 250;
    attackAnimationSpeed = 80;
    lastAttackFrameTime = Date.now();
    isAttacking = false;
    attackHitFrame = 4;

    deathImage;
    currentDeathFrame = 0;
    deathSpriteWidth = 150;
    deathSpriteHeight = 150;
    deathFrameCount = 4;
    deathDisplayWidth = 250;
    deathDisplayHeight = 250;
    deathAnimationSpeed = 150;
    lastDeathFrameTime = Date.now();
    deathAnimationFinished = false;

    startY;
    waveAmplitude = 50;
    waveFrequency = 0.03;
    waveOffset = 0;

    turnTowardsCharacter = true;
    attackRange = 100;
    attackCooldown = 2500;
    lastAttackTime = 0;

    isFalling = false;
    fallSpeed = 0;
    fallAcceleration = 0.5;
    groundY = 250;

    /**
     * Creates a new flying eye enemy with random position and wave movement
     * @function constructor
     * @returns {void}
     */
    constructor() {
        super();
        this.loadFlightImage('./assets/monsters/Flying eye/Flight.png');
        this.loadAttackImage('./assets/monsters/Flying eye/Attack.png');
        this.loadDeathImage('./assets/monsters/Flying eye/Death.png');

        this.x = 300 + Math.random() * 600;
        this.startY = 50 + Math.random() * 100;
        this.y = this.startY;
        this.speed = 0.6 + Math.random() * 0.6;
        this.waveOffset = Math.random() * Math.PI * 2;
        this.otherDirection = true;

        this.animate();
        this.moveWithWave();
    }

    /**
     * Loads the flight animation sprite sheet
     * @function loadFlightImage
     * @param {string} path - Path to the flight image file
     * @returns {void}
     */
    loadFlightImage(path) {
        this.flightImage = new Image();
        this.flightImage.src = path;
    }

    /**
     * Loads the attack animation sprite sheet
     * @function loadAttackImage
     * @param {string} path - Path to the attack image file
     * @returns {void}
     */
    loadAttackImage(path) {
        this.attackImage = new Image();
        this.attackImage.src = path;
    }

    /**
     * Loads the death animation sprite sheet
     * @function loadDeathImage
     * @param {string} path - Path to the death image file
     * @returns {void}
     */
    loadDeathImage(path) {
        this.deathImage = new Image();
        this.deathImage.src = path;
    }

    /**
     * Updates flight animation frame cycling
     * @function updateFlightAnimation
     * @returns {void}
     */
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

    /**
     * Updates attack animation frame cycling
     * @function updateAttackAnimation
     * @returns {void}
     */
    updateAttackAnimation() {
        if (!this.isAttacking) return;

        let now = Date.now();
        if (now - this.lastAttackFrameTime > this.attackAnimationSpeed) {
            this.advanceAttackFrame(now);
        }
    }

    /**
     * Advances attack animation frame and handles attack logic
     * @function advanceAttackFrame
     * @param {number} now - Current timestamp
     * @returns {void}
     */
    advanceAttackFrame(now) {
        this.currentAttackFrame++;

        if (this.currentAttackFrame === this.attackHitFrame && this.world) {
            this.dealDamageToCharacter();
        }

        if (this.currentAttackFrame >= this.attackFrameCount) {
            this.endAttackAnimation();
        }
        this.lastAttackFrameTime = now;
    }

    /**
     * Ends the attack animation and resets state
     * @function endAttackAnimation
     * @returns {void}
     */
    endAttackAnimation() {
        this.isAttacking = false;
        this.currentAttackFrame = 0;
    }

    /**
     * Updates death animation frame cycling
     * @function updateDeathAnimation
     * @returns {void}
     */
    updateDeathAnimation() {
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
    }

    /**
     * Draws a sprite frame from a sprite sheet
     * @function drawSprite
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Image} image - Sprite sheet image
     * @param {number} frameX - X position of the frame in sprite sheet
     * @param {number} frameWidth - Width of each frame
     * @param {number} frameHeight - Height of each frame
     * @param {number} displayWidth - Width to display the sprite
     * @param {number} displayHeight - Height to display the sprite
     * @returns {void}
     */
    drawSprite(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight) {
        if (!image || !image.complete) return;

        ctx.imageSmoothingEnabled = false;

        if (this.otherDirection) {
            this.drawFlippedSprite(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight);
        } else {
            this.drawNormalSprite(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight);
        }

        ctx.imageSmoothingEnabled = true;
    }

    /**
     * Draws a horizontally flipped sprite
     * @function drawFlippedSprite
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Image} image - Sprite sheet image
     * @param {number} frameX - X position of the frame in sprite sheet
     * @param {number} frameWidth - Width of each frame
     * @param {number} frameHeight - Height of each frame
     * @param {number} displayWidth - Width to display the sprite
     * @param {number} displayHeight - Height to display the sprite
     * @returns {void}
     */
    drawFlippedSprite(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight) {
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
    }

    /**
     * Draws a normal (non-flipped) sprite
     * @function drawNormalSprite
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Image} image - Sprite sheet image
     * @param {number} frameX - X position of the frame in sprite sheet
     * @param {number} frameWidth - Width of each frame
     * @param {number} frameHeight - Height of each frame
     * @param {number} displayWidth - Width to display the sprite
     * @param {number} displayHeight - Height to display the sprite
     * @returns {void}
     */
    drawNormalSprite(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight) {
        ctx.drawImage(
            image,
            frameX, 0,
            frameWidth, frameHeight,
            this.x, this.y,
            displayWidth, displayHeight
        );
    }

    /**
     * Draws the flight animation sprite
     * @function drawFlightSprite
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    drawFlightSprite(ctx) {
        let frameX = this.currentFlightFrame * this.flightSpriteWidth;
        this.drawSprite(ctx, this.flightImage, frameX,
            this.flightSpriteWidth, this.flightSpriteHeight,
            this.flightDisplayWidth, this.flightDisplayHeight);
    }

    /**
     * Draws the attack animation sprite
     * @function drawAttackSprite
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    drawAttackSprite(ctx) {
        let frameX = this.currentAttackFrame * this.attackSpriteWidth;
        this.drawSprite(ctx, this.attackImage, frameX,
            this.attackSpriteWidth, this.attackSpriteHeight,
            this.attackDisplayWidth, this.attackDisplayHeight);
    }

    /**
     * Draws the death animation sprite
     * @function drawDeathSprite
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    drawDeathSprite(ctx) {
        let frameX = this.currentDeathFrame * this.deathSpriteWidth;
        this.drawSprite(ctx, this.deathImage, frameX,
            this.deathSpriteWidth, this.deathSpriteHeight,
            this.deathDisplayWidth, this.deathDisplayHeight);
    }

    /**
     * Initiates wave-based movement animation
     * @function moveWithWave
     * @returns {void}
     */
    moveWithWave() {
        setInterval(() => {
            if (this.world && this.world.isPaused) return;

            if (this.handleDeathFalling()) return;
            if (this.isDead) return;

            this.updateHorizontalMovement();
            this.updateWaveMovement();
        }, 1000 / 60);
    }

    /**
     * Handles death falling physics and state
     * @function handleDeathFalling
     * @returns {boolean} - Returns true if currently falling
     */
    handleDeathFalling() {
        if (this.isDead && !this.isFalling) {
            this.isFalling = true;
            this.fallSpeed = 0;
        }

        if (this.isFalling) {
            this.applyFallingGravity();
            return true;
        }

        return false;
    }

    /**
     * Applies falling gravity physics
     * @function applyFallingGravity
     * @returns {void}
     */
    applyFallingGravity() {
        if (this.y < this.groundY) {
            this.fallSpeed += this.fallAcceleration;
            this.y += this.fallSpeed;

            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.isFalling = false;
            }
        }
    }

    /**
     * Updates horizontal movement position
     * @function updateHorizontalMovement
     * @returns {void}
     */
    updateHorizontalMovement() {
        this.x -= this.speed;
    }

    /**
     * Updates wave-based vertical movement
     * @function updateWaveMovement
     * @returns {void}
     */
    updateWaveMovement() {
        this.waveOffset += this.waveFrequency;
        this.y = this.startY + Math.sin(this.waveOffset) * this.waveAmplitude;
    }

    /**
     * Starts animation intervals for all animations
     * @function animate
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            if (this.world && this.world.isPaused) return;
            
            this.updateFlightAnimation();
            this.updateAttackAnimation();
            this.updateDeathAnimation();
        }, 1000 / 60);
    }

    /**
     * Attempts to attack character if within range
     * @function tryAttack
     * @param {Character} character - The character to attack
     * @returns {void}
     */
    tryAttack(character) {
        if (this.isDead || this.isAttacking) return;

        let distance = Math.abs(this.x - character.x);
        let now = Date.now();

        if (distance <= this.attackRange && now - this.lastAttackTime >= this.attackCooldown) {
            this.isAttacking = true;
            this.currentAttackFrame = 0;
            this.lastAttackTime = now;
        }
    }

    /**
     * Deals damage to character during attack frame
     * @function dealDamageToCharacter
     * @returns {void}
     */
    dealDamageToCharacter() {
        if (!this.world || !this.world.character) return;

        let distance = Math.abs(this.x - this.world.character.x);

        if (distance <= this.attackRange + 20) {
            this.world.character.takeAttackDamage(CONFIG.DAMAGE.FLYING_EYE_ATTACK);
            console.log('Flying Eye dealt damage to character!');
        }
    }

    /**
     * Handles death state and animation
     * @function die
     * @returns {void}
     */
    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.currentDeathFrame = 0;
        this.deathAnimationFinished = false;
        this.speed = 0;
        console.log('Flying Eye died!');
    }

    /**
     * Draws collision frame for debugging
     * @function drawFrame
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    drawFrame(ctx) {
        if (!CONFIG.SHOW_COLLISION_BOXES) return;

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
