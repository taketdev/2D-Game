class Endboss extends MovableObject {
    y = 160;
    height = 400;
    width = 350;

    maxHP = 250;
    currentHP = 250;
    isDead = false;

    collisionOffsetX = 100;
    collisionOffsetY = 70;
    collisionWidth = 150;
    collisionHeight = 210;

    idleImage;
    currentIdleFrame = 0;
    idleSpriteWidth = 176;
    idleSpriteHeight = 144;
    idleFrameCount = 13;
    idleDisplayWidth = 350;
    idleDisplayHeight = 350;
    idleAnimationSpeed = 80;
    lastIdleFrameTime = Date.now();

    walkImage;
    currentWalkFrame = 0;
    walkSpriteWidth = 176;
    walkSpriteHeight = 144;
    walkFrameCount = 10;
    walkDisplayWidth = 350;
    walkDisplayHeight = 350;
    walkAnimationSpeed = 60;
    lastWalkFrameTime = Date.now();

    hitImage;
    currentHitFrame = 0;
    hitSpriteWidth = 176;
    hitSpriteHeight = 144;
    hitFrameCount = 5;
    hitDisplayWidth = 350;
    hitDisplayHeight = 350;
    hitAnimationSpeed = 100;
    lastHitFrameTime = Date.now();
    isTakingHit = false;

    attack2Image;
    currentAttack2Frame = 0;
    attack2SpriteWidth = 176;
    attack2SpriteHeight = 144;
    attack2FrameCount = 12;
    attack2DisplayWidth = 350;
    attack2DisplayHeight = 350;
    attack2AnimationSpeed = 80;
    lastAttack2FrameTime = Date.now();
    isAttacking2 = false;

    attack3Image;
    currentAttack3Frame = 0;
    attack3SpriteWidth = 176;
    attack3SpriteHeight = 144;
    attack3FrameCount = 12;
    attack3DisplayWidth = 350;
    attack3DisplayHeight = 350;
    attack3AnimationSpeed = 80;
    lastAttack3FrameTime = Date.now();
    isAttacking3 = false;

    deathImage;
    currentDeathFrame = 0;
    deathSpriteWidth = 176;
    deathSpriteHeight = 144;
    deathFrameCount = 13;
    deathDisplayWidth = 350;
    deathDisplayHeight = 350;
    deathAnimationSpeed = 150;
    lastDeathFrameTime = Date.now();
    deathAnimationFinished = false;

    isWalking = false;

    turnTowardsCharacter = false;
    aggroRange = 450;
    isAggro = false;
    baseSpeed = 0.8;
    phase2SpeedMultiplier = 1.5;
    targetCharacterX = 0;

    attackRange = 120;
    attack2Cooldown = 3000;
    attack3Cooldown = 4000;
    lastAttack2Time = 0;
    lastAttack3Time = 0;
    attack2HitFrame = 6;
    attack3HitFrame = 6;

    /**
     * Creates a new endboss with all properties and starts animations
     * @function constructor
     * @returns {void}
     */
    constructor(){
        super();
        this.loadIdleImage('./assets/werwolf boss/Idle.png');
        this.loadWalkImage('./assets/werwolf boss/Walk.png');
        this.loadHitImage('./assets/werwolf boss/Hit.png');
        this.loadAttack2Image('./assets/werwolf boss/Attack2.png');
        this.loadAttack3Image('./assets/werwolf boss/Attack3.png');
        this.loadDeathImage('./assets/werwolf boss/Death.png');
        this.x = 4700;
        this.speed = this.baseSpeed;
        this.animate();
        this.updateAI();
    }

    /**
     * Loads the idle animation sprite sheet
     * @function loadIdleImage
     * @param {string} path - Path to the idle image file
     * @returns {void}
     */
    loadIdleImage(path) {
        this.idleImage = new Image();
        this.idleImage.src = path;
    }

    /**
     * Loads the walking animation sprite sheet
     * @function loadWalkImage
     * @param {string} path - Path to the walk image file
     * @returns {void}
     */
    loadWalkImage(path) {
        this.walkImage = new Image();
        this.walkImage.src = path;
    }

    /**
     * Loads the hit animation sprite sheet
     * @function loadHitImage
     * @param {string} path - Path to the hit image file
     * @returns {void}
     */
    loadHitImage(path) {
        this.hitImage = new Image();
        this.hitImage.src = path;
    }

    /**
     * Loads the attack 2 animation sprite sheet
     * @function loadAttack2Image
     * @param {string} path - Path to the attack 2 image file
     * @returns {void}
     */
    loadAttack2Image(path) {
        this.attack2Image = new Image();
        this.attack2Image.src = path;
    }

    /**
     * Loads the attack 3 animation sprite sheet
     * @function loadAttack3Image
     * @param {string} path - Path to the attack 3 image file
     * @returns {void}
     */
    loadAttack3Image(path) {
        this.attack3Image = new Image();
        this.attack3Image.src = path;
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
     * Starts all animation update loops for the endboss
     * @function animate
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            if (this.world && this.world.isPaused) return;

            this.updateIdleAnimation();
            this.updateWalkAnimation();
            this.updateHitAnimation();
            this.updateAttack2Animation();
            this.updateAttack3Animation();
            this.updateDeathAnimation();
        }, 1000 / 60);
    }

    /**
     * Draws a sprite with optional direction flipping and anti-aliasing
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
     * Draws sprite flipped horizontally for opposite direction
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
     * Draws sprite in normal orientation
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
     * Draws the idle animation sprite
     * @function drawIdleSprite
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    drawIdleSprite(ctx) {
        let frameX = this.currentIdleFrame * this.idleSpriteWidth;
        this.drawSprite(ctx, this.idleImage, frameX,
            this.idleSpriteWidth, this.idleSpriteHeight,
            this.idleDisplayWidth, this.idleDisplayHeight);
    }

    /**
     * Draws the walking animation sprite
     * @function drawWalkSprite
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    drawWalkSprite(ctx) {
        let frameX = this.currentWalkFrame * this.walkSpriteWidth;
        this.drawSprite(ctx, this.walkImage, frameX,
            this.walkSpriteWidth, this.walkSpriteHeight,
            this.walkDisplayWidth, this.walkDisplayHeight);
    }

    /**
     * Draws the hit animation sprite
     * @function drawHitSprite
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    drawHitSprite(ctx) {
        let frameX = this.currentHitFrame * this.hitSpriteWidth;
        this.drawSprite(ctx, this.hitImage, frameX,
            this.hitSpriteWidth, this.hitSpriteHeight,
            this.hitDisplayWidth, this.hitDisplayHeight);
    }

    /**
     * Draws the attack 2 animation sprite
     * @function drawAttack2Sprite
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    drawAttack2Sprite(ctx) {
        let frameX = this.currentAttack2Frame * this.attack2SpriteWidth;
        this.drawSprite(ctx, this.attack2Image, frameX,
            this.attack2SpriteWidth, this.attack2SpriteHeight,
            this.attack2DisplayWidth, this.attack2DisplayHeight);
    }

    /**
     * Draws the attack 3 animation sprite
     * @function drawAttack3Sprite
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    drawAttack3Sprite(ctx) {
        let frameX = this.currentAttack3Frame * this.attack3SpriteWidth;
        this.drawSprite(ctx, this.attack3Image, frameX,
            this.attack3SpriteWidth, this.attack3SpriteHeight,
            this.attack3DisplayWidth, this.attack3DisplayHeight);
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
     * Draws debug collision frame for development purposes
     * @function drawFrame
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
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
