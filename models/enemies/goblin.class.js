class Goblin extends MovableObject {
    y = 190;
    height = 250;
    width = 250;

    maxHP = 30;
    currentHP = 30;
    isDead = false;

    collisionOffsetX = 90;
    collisionOffsetY = 80;
    collisionWidth = 65;
    collisionHeight = 100;

    idleImage;
    currentIdleFrame = 0;
    idleSpriteWidth = 150;
    idleSpriteHeight = 150;
    idleFrameCount = 4;
    idleDisplayWidth = 250;
    idleDisplayHeight = 250;
    idleAnimationSpeed = 150;
    lastIdleFrameTime = Date.now();

    runImage;
    currentRunFrame = 0;
    runSpriteWidth = 150;
    runSpriteHeight = 150;
    runFrameCount = 8;
    runDisplayWidth = 250;
    runDisplayHeight = 250;
    runAnimationSpeed = 120;
    lastRunFrameTime = Date.now();

    takeHitImage;
    currentTakeHitFrame = 0;
    takeHitSpriteWidth = 150;
    takeHitSpriteHeight = 150;
    takeHitFrameCount = 4;
    takeHitDisplayWidth = 250;
    takeHitDisplayHeight = 250;
    takeHitAnimationSpeed = 100;
    lastTakeHitFrameTime = Date.now();
    isTakingHit = false;

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

    isRunning = true;

    patrolStartX;
    patrolEndX;
    patrolRange = 300;
    movingRight = false;

    turnTowardsCharacter = false;
    aggroRange = 300;
    isAggro = false;
    targetCharacterX = 0;
    attackRange = 80;
    attackCooldown = 2000;
    lastAttackTime = 0;

    patrolIntervalId;
    animationIntervalId;

    /**
     * Initializes a new Goblin enemy with animations and patrol behavior
     * @function constructor
     * @returns {void}
     */
    constructor() {
        super();
        this.loadAllImages();
        this.initializePosition();
        this.setupPatrolArea();
        this.animate();
        this.patrol();
    }

    /**
     * Loads all sprite sheet images for different animation states
     * @function loadAllImages
     * @returns {void}
     */
    loadAllImages() {
        this.loadIdleImage('./assets/monsters/Goblin/Idle.png');
        this.loadRunImage('./assets/monsters/Goblin/Run.png');
        this.loadTakeHitImage('./assets/monsters/Goblin/Take Hit.png');
        this.loadAttackImage('./assets/monsters/Goblin/Attack.png');
        this.loadDeathImage('./assets/monsters/Goblin/Death.png');
    }

    /**
     * Sets initial position and movement speed with random variation
     * @function initializePosition
     * @returns {void}
     */
    initializePosition() {
        this.x = 200 + Math.random() * 500;
        this.speed = 0.5 + Math.random() * 0.5;
    }

    /**
     * Configures patrol area boundaries and initial direction
     * @function setupPatrolArea
     * @returns {void}
     */
    setupPatrolArea() {
        this.patrolStartX = this.x;
        this.patrolEndX = this.x + this.patrolRange;
        this.movingRight = Math.random() > 0.5;
        this.otherDirection = !this.movingRight;
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
     * Loads the run animation sprite sheet
     * @function loadRunImage
     * @param {string} path - Path to the run image file
     * @returns {void}
     */
    loadRunImage(path) {
        this.runImage = new Image();
        this.runImage.src = path;
    }

    /**
     * Loads the take hit animation sprite sheet
     * @function loadTakeHitImage
     * @param {string} path - Path to the take hit image file
     * @returns {void}
     */
    loadTakeHitImage(path) {
        this.takeHitImage = new Image();
        this.takeHitImage.src = path;
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
     * Updates idle animation frame cycling
     * @function updateIdleAnimation
     * @returns {void}
     */
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

    /**
     * Updates run animation frame cycling
     * @function updateRunAnimation
     * @returns {void}
     */
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
     * Draws the run animation sprite
     * @function drawRunSprite
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    drawRunSprite(ctx) {
        let frameX = this.currentRunFrame * this.runSpriteWidth;
        this.drawSprite(ctx, this.runImage, frameX,
            this.runSpriteWidth, this.runSpriteHeight,
            this.runDisplayWidth, this.runDisplayHeight);
    }

    /**
     * Draws the take hit animation sprite
     * @function drawTakeHitSprite
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    drawTakeHitSprite(ctx) {
        let frameX = this.currentTakeHitFrame * this.takeHitSpriteWidth;
        this.drawSprite(ctx, this.takeHitImage, frameX,
            this.takeHitSpriteWidth, this.takeHitSpriteHeight,
            this.takeHitDisplayWidth, this.takeHitDisplayHeight);
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
     * Initiates patrol behavior with movement logic
     * @function patrol
     * @returns {void}
     */
    patrol() {
        this.patrolIntervalId = setInterval(() => {
            if (this.shouldSkipPatrol()) return;

            if (this.isAggro) {
                this.handleAggroMovement();
            } else {
                this.handlePatrolMovement();
            }
        }, 1000 / 60);
    }

    /**
     * Starts animation intervals for all animations
     * @function animate
     * @returns {void}
     */
    animate() {
        this.animationIntervalId = setInterval(() => {
            if (this.world && this.world.isPaused) return;

            this.updateIdleAnimation();
            this.updateRunAnimation();
            this.updateTakeHitAnimation();
            this.updateAttackAnimation();
            this.updateDeathAnimation();
        }, 1000 / 60);
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
            this.world.character.takeAttackDamage(CONFIG.DAMAGE.GOBLIN_ATTACK);
            console.log('Goblin dealt damage to character!');
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
        console.log('Goblin died!');
        this.cleanup();
    }

    /**
     * Clears all active intervals to prevent memory leaks
     * @function cleanup
     * @returns {void}
     */
    cleanup() {
        if (this.patrolIntervalId) {
            clearInterval(this.patrolIntervalId);
            this.patrolIntervalId = null;
        }
        if (this.animationIntervalId) {
            clearInterval(this.animationIntervalId);
            this.animationIntervalId = null;
        }
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
