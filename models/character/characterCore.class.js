class Character extends MovableObject {
    width = 200;
    height = 200;
    y = 165;
    speed = 8;
    world;

    maxHP = 100;
    currentHP = 100;
    isDead = false;

    maxMana = 100;
    currentMana = 100;
    manaCostPerSpell = 20;
    manaRegenRate = 5;

    collisionOffsetX = 60;
    collisionOffsetY = 90;
    collisionWidth = 80;
    collisionHeight = 115;

    movementIntervalId;
    animationIntervalId;
    manaRegenIntervalId;

    isKnockedBack = false;
    knockbackForce = 0;
    knockbackDirection = 1;
    invulnerable = false;
    invulnerableTime = 1000;
    lastHitTime = 0;

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

    walkImage;
    currentWalkFrame = 0;
    walkFrameWidth = 128;
    walkFrameHeight = 128;
    walkframeCount = 7;
    walkFrameCount = 7;
    walkAnimationSpeed = 150;
    lastWalkFrameTime= Date.now();
    walkDisplayWidth = 200;
    walkDisplayHeight = 200;

    jumpImage;
    currentJumpFrame = 3;
    jumpFrameWidth = 128;
    jumpFrameHeight = 128;
    jumpFrameCount = 8;
    jumpAnimationSpeed = 200;
    lastJumpFrameTime = Date.now();
    jumpDisplayWidth = 200;
    jumpDisplayHeight = 200;

    runImage;
    currentRunFrame = 0;
    runFrameWidth = 128;
    runFrameHeight = 128;
    runFrameCount = 8;
    runAnimationSpeed = 80;
    lastRunFrameTime = Date.now();
    runDisplayWidth = 200;
    runDisplayHeight = 200;

    hurtImage;
    currentHurtFrame = 0;
    hurtFrameWidth = 128;
    hurtFrameHeight = 128;
    hurtFrameCount = 3;
    hurtDisplayWidth = 200;
    hurtDisplayHeight = 200;
    hurtAnimationSpeed = 100;
    lastHurtFrameTime = Date.now();
    isHurt = false;

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

    attack1Image;
    currentAttack1Frame = 0;
    attack1FrameWidth = 128;
    attack1FrameHeight = 128;
    attack1FrameCount = 7;
    attack1DisplayWidth = 200;
    attack1DisplayHeight = 200;
    attack1AnimationSpeed = 80;
    lastAttack1FrameTime = Date.now();
    isAttacking1 = false;
    attack1Cooldown = 300;
    lastAttack1Time = 0;
    attack1ProjectileSpawned = false;

    attack2Image;
    currentAttack2Frame = 0;
    attack2FrameWidth = 128;
    attack2FrameHeight = 128;
    attack2FrameCount = 9;
    attack2DisplayWidth = 200;
    attack2DisplayHeight = 200;
    attack2AnimationSpeed = 80;
    lastAttack2FrameTime = Date.now();
    isAttacking2 = false;
    attack2Cooldown = 500;
    lastAttack2Time = 0;
    attack2ProjectileSpawned = false;


    /**
     * Creates a new character with default properties and loads all sprites
     * @function constructor
     * @returns {void}
     */
    constructor() {
        super();
        this.loadIdleImage('./assets/wizard_assets/Wanderer Magican/Idle.png');
        this.loadWalkImage('./assets/wizard_assets/Wanderer Magican/Walk.png');
        this.loadJumpImage('./assets/wizard_assets/Wanderer Magican/Jump.png');
        this.loadRunImage('./assets/wizard_assets/Wanderer Magican/Run.png');
        this.loadHurtImage('./assets/wizard_assets/Wanderer Magican/Hurt.png');
        this.loadDeathImage('./assets/wizard_assets/Wanderer Magican/Dead.png');
        this.loadAttack1Image('./assets/wizard_assets/Wanderer Magican/Attack_1.png');
        this.loadAttack2Image('./assets/wizard_assets/Wanderer Magican/Attack_2.png');
        this.animate();
        this.applyGravity();
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
     * Loads the jumping animation sprite sheet
     * @function loadJumpImage
     * @param {string} path - Path to the jump image file
     * @returns {void}
     */
    loadJumpImage(path) {
        this.jumpImage = new Image();
        this.jumpImage.src = path;
    }

    /**
     * Loads the running animation sprite sheet
     * @function loadRunImage
     * @param {string} path - Path to the run image file
     * @returns {void}
     */
    loadRunImage(path) {
        this.runImage = new Image();
        this.runImage.src = path;
    }

    /**
     * Loads the hurt animation sprite sheet
     * @function loadHurtImage
     * @param {string} path - Path to the hurt image file
     * @returns {void}
     */
    loadHurtImage(path) {
        this.hurtImage = new Image();
        this.hurtImage.src = path;
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
     * Loads the attack 1 animation sprite sheet
     * @function loadAttack1Image
     * @param {string} path - Path to the attack 1 image file
     * @returns {void}
     */
    loadAttack1Image(path) {
        this.attack1Image = new Image();
        this.attack1Image.src = path;
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
     * Starts all character animation and movement loops
     * @function animate
     * @returns {void}
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
        this.startManaRegenerationLoop();
    }

    /**
     * Cleans up all active intervals to prevent memory leaks
     * @function cleanup
     * @returns {void}
     */
    cleanup() {
        if (this.movementIntervalId) {
            clearInterval(this.movementIntervalId);
            this.movementIntervalId = null;
        }
        if (this.animationIntervalId) {
            clearInterval(this.animationIntervalId);
            this.animationIntervalId = null;
        }
        if (this.manaRegenIntervalId) {
            clearInterval(this.manaRegenIntervalId);
            this.manaRegenIntervalId = null;
        }
    }

    /**
     * Draws debug collision frame for development purposes
     * @function drawFrame
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
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
