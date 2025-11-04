/**
 * Character Movement System
 * Contains all movement-related functions
 */

// Movement Loop
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

Character.prototype.handleMovement = function() {
    if (!this.world || this.isDead) return;

    this.handleAttackInput();
    if (this.isAttacking1 || this.isAttacking2) return;

    const movementState = this.handleMovementInput();
    this.updateMovementStatus(movementState);
};

Character.prototype.handleMovementInput = function() {
    let isMoving = false;
    let isRunning = this.world.keyboard.SHIFT;

    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        let moveSpeed = isRunning ? this.speed * 1.3 : this.speed;
        this.x += moveSpeed;
        this.otherDirection = false;
        isMoving = true;
    }

    if (this.world.keyboard.LEFT && this.x > this.world.level.level_start_x) {
        let moveSpeed = isRunning ? this.speed * 1.3 : this.speed;
        this.x -= moveSpeed;
        this.otherDirection = true;
        isMoving = true;
    }

    if (this.world.keyboard.SPACE || this.world.keyboard.UP) {
        this.jump();
        isMoving = true;
    }

    return { isMoving, isRunning };
};

Character.prototype.updateMovementStatus = function(movementState) {
    this.isIdle = !movementState.isMoving && !this.isAboveGround();
    this.isRunning = movementState.isRunning && movementState.isMoving && !this.isAboveGround();
};

Character.prototype.updateCamera = function() {
    if (this.world) {
        // Runde die Kamera-Position auf ganze Zahlen um Sub-Pixel-Rendering zu vermeiden
        this.world.camera_x = Math.round(-this.x + 100);
    }
};

Character.prototype.jump = function() {
    if (!this.isAboveGround()) {
        this.speedY = 15;   // Jump force upward
        this.currentJumpFrame = 3;  // start at frame 3
    }
};

// Knockback System
Character.prototype.applyPushback = function(enemyX) {
    if (this.isDead || this.isKnockedBack) return;

    this.isKnockedBack = true;
    this.determinePushbackDirection(enemyX);
    this.knockbackForce = 2;
    this.schedulePushbackEnd();
};

Character.prototype.determinePushbackDirection = function(enemyX) {
    if (this.x < enemyX) {
        this.knockbackDirection = -1;
    } else {
        this.knockbackDirection = 1;
    }
};

Character.prototype.schedulePushbackEnd = function() {
    setTimeout(() => {
        this.isKnockedBack = false;
        this.knockbackForce = 0;
    }, 150);
};

Character.prototype.updateKnockback = function() {
    if (this.isKnockedBack && this.knockbackForce > 0) {
        // Berechne neue Position
        let newX = this.x + this.knockbackDirection * this.knockbackForce;

        // Level-Grenzen: nutze die Level-Properties für konsistente Grenzen
        let minX = this.world ? this.world.level.level_start_x : 0;
        let maxX = this.world ? this.world.level.level_end_x : 5000;

        // Begrenze Position innerhalb der Level-Grenzen
        this.x = Math.max(minX, Math.min(maxX, newX));

        this.knockbackForce *= 0.7; // Schneller abbremsen (statt 0.85)
    }
};
