/**
 * Character Movement System
 * Contains all movement-related functions
 */

/**
 * Starts the main movement loop that handles all character updates
 * @function startMovementLoop
 * @returns {void}
 */
Character.prototype.startMovementLoop = function() {
    this.movementIntervalId = setInterval(() => {
        if (this.world && this.world.isPaused) return;

        this.updateKnockback();
        this.handleMovement();
        this.updateCamera();
        this.updateAttack1Animation();
        this.updateAttack2Animation();
    }, 1000 / 60);
};

/**
 * Handles character movement input and state management
 * @function handleMovement
 * @returns {void}
 */
Character.prototype.handleMovement = function() {
    if (!this.world || this.isDead) return;

    this.handleAttackInput();
    if (this.isAttacking1 || this.isAttacking2) return;

    const movementState = this.handleMovementInput();
    this.updateMovementStatus(movementState);
};

/**
 * Processes keyboard input for character movement and returns movement state
 * @function handleMovementInput
 * @returns {Object} Object containing isMoving and isRunning flags
 */
Character.prototype.handleMovementInput = function() {
    let isMoving = false;
    let isRunning = this.world.keyboard.SHIFT;
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.handleRightMovement(isRunning);
        isMoving = true;
    }
    if (this.world.keyboard.LEFT && this.x > this.world.level.level_start_x) {
        this.handleLeftMovement(isRunning);
        isMoving = true;
    }
    if (this.world.keyboard.SPACE || this.world.keyboard.UP) {
        this.jump();
        isMoving = true;
    }
    return { isMoving, isRunning };
};

/**
 * Handles character movement to the right
 * @function handleRightMovement
 * @param {boolean} isRunning - Whether shift key is pressed
 * @returns {void}
 */
Character.prototype.handleRightMovement = function(isRunning) {
    let moveSpeed = isRunning ? this.speed * 1.3 : this.speed;
    this.x += moveSpeed;
    this.otherDirection = false;
};

/**
 * Handles character movement to the left
 * @function handleLeftMovement
 * @param {boolean} isRunning - Whether shift key is pressed
 * @returns {void}
 */
Character.prototype.handleLeftMovement = function(isRunning) {
    let moveSpeed = isRunning ? this.speed * 1.3 : this.speed;
    this.x -= moveSpeed;
    this.otherDirection = true;
};

/**
 * Updates character movement status flags based on input state
 * @function updateMovementStatus
 * @param {Object} movementState - Object containing movement flags
 * @returns {void}
 */
Character.prototype.updateMovementStatus = function(movementState) {
    this.isIdle = !movementState.isMoving && !this.isAboveGround();
    this.isRunning = movementState.isRunning && movementState.isMoving && !this.isAboveGround();
};

/**
 * Updates camera position to follow the character
 * @function updateCamera
 * @returns {void}
 */
Character.prototype.updateCamera = function() {
    if (this.world) {
        this.world.camera_x = Math.round(-this.x + 100);
    }
};

/**
 * Makes the character jump if they are on the ground
 * @function jump
 * @returns {void}
 */
Character.prototype.jump = function() {
    if (!this.isAboveGround()) {
        this.speedY = 15;
        this.currentJumpFrame = 3;
    }
};

/**
 * Applies pushback effect when hit by an enemy
 * @function applyPushback
 * @param {number} enemyX - X position of the enemy causing pushback
 * @returns {void}
 */
Character.prototype.applyPushback = function(enemyX) {
    if (this.isDead || this.isKnockedBack) return;

    this.isKnockedBack = true;
    this.determinePushbackDirection(enemyX);
    this.knockbackForce = 2;
    this.schedulePushbackEnd();
};

/**
 * Determines the direction of pushback based on enemy position
 * @function determinePushbackDirection
 * @param {number} enemyX - X position of the enemy
 * @returns {void}
 */
Character.prototype.determinePushbackDirection = function(enemyX) {
    if (this.x < enemyX) {
        this.knockbackDirection = -1;
    } else {
        this.knockbackDirection = 1;
    }
};

/**
 * Schedules the end of the pushback effect after a delay
 * @function schedulePushbackEnd
 * @returns {void}
 */
Character.prototype.schedulePushbackEnd = function() {
    setTimeout(() => {
        this.isKnockedBack = false;
        this.knockbackForce = 0;
    }, 150);
};

/**
 * Updates knockback physics and applies level boundary constraints
 * @function updateKnockback
 * @returns {void}
 */
Character.prototype.updateKnockback = function() {
    if (this.isKnockedBack && this.knockbackForce > 0) {
        let newX = this.x + this.knockbackDirection * this.knockbackForce;

        let minX = this.world ? this.world.level.level_start_x : 0;
        let maxX = this.world ? this.world.level.level_end_x : 5000;

        this.x = Math.max(minX, Math.min(maxX, newX));

        this.knockbackForce *= 0.7;
    }
};
