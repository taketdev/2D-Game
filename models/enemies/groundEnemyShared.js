/**
 * Shared prototype functions for ground-based enemies (Goblin, Skeleton, Mushroom)
 * These functions are identical across all three enemy types
 */

/**
 * Assigns shared drawing functions to an enemy class
 * @function assignSharedDrawingFunctions
 * @param {Function} enemyClass - The enemy class to assign functions to
 * @returns {void}
 */
function assignSharedDrawingFunctions(enemyClass) {
    /**
     * Draws a sprite frame from a sprite sheet with direction handling
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
    enemyClass.prototype.drawSprite = function(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight) {
        if (!image || !image.complete) return;

        ctx.imageSmoothingEnabled = false;

        if (this.otherDirection) {
            this.drawFlippedSprite(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight);
        } else {
            this.drawNormalSprite(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight);
        }

        ctx.imageSmoothingEnabled = true;
    };

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
    enemyClass.prototype.drawFlippedSprite = function(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight) {
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
    };

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
    enemyClass.prototype.drawNormalSprite = function(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight) {
        ctx.drawImage(
            image,
            frameX, 0,
            frameWidth, frameHeight,
            this.x, this.y,
            displayWidth, displayHeight
        );
    };
}

/**
 * Assigns shared patrol and movement functions to an enemy class
 * @function assignSharedPatrolFunctions
 * @param {Function} enemyClass - The enemy class to assign functions to
 * @returns {void}
 */
function assignSharedPatrolFunctions(enemyClass) {
    /**
     * Checks if patrol behavior should be skipped
     * @function shouldSkipPatrol
     * @returns {boolean} True if patrol should be skipped
     */
    enemyClass.prototype.shouldSkipPatrol = function() {
        if (this.world && this.world.isPaused) return true;
        if (this.isDead) return true;
        if (this.isAttacking) return true;
        return false;
    };

    /**
     * Handles movement when enemy is in aggro mode towards character
     * @function handleAggroMovement
     * @returns {void}
     */
    enemyClass.prototype.handleAggroMovement = function() {
        let distanceToTarget = this.targetCharacterX - this.x;
        let absDistance = Math.abs(distanceToTarget);

        if (absDistance < 30) {
            return;
        }

        if (distanceToTarget < 0) {
            this.x -= this.speed * 0.7;
            this.otherDirection = true;
        } else {
            this.x += this.speed * 0.7;
            this.otherDirection = false;
        }
    };

    /**
     * Handles standard patrol movement between boundaries
     * @function handlePatrolMovement
     * @returns {void}
     */
    enemyClass.prototype.handlePatrolMovement = function() {
        if (this.movingRight) {
            this.x += this.speed;
            this.otherDirection = false;
        } else {
            this.x -= this.speed;
            this.otherDirection = true;
        }

        if (this.x >= this.patrolEndX) {
            this.movingRight = false;
        } else if (this.x <= this.patrolStartX) {
            this.movingRight = true;
        }
    };

    /**
     * Sets aggro state based on character proximity
     * @function setAggro
     * @param {Character} character - The character to check distance to
     * @returns {void}
     */
    enemyClass.prototype.setAggro = function(character) {
        if (character.isDead) {
            this.isAggro = false;
            return;
        }

        let distance = Math.abs(this.x - character.x);
        this.isAggro = distance <= this.aggroRange;
        this.targetCharacterX = character.x;
    };
}

/**
 * Assigns shared animation functions to an enemy class
 * @function assignSharedAnimationFunctions
 * @param {Function} enemyClass - The enemy class to assign functions to
 * @returns {void}
 */
function assignSharedAnimationFunctions(enemyClass) {
    /**
     * Updates take hit animation frame cycling
     * @function updateTakeHitAnimation
     * @returns {void}
     */
    enemyClass.prototype.updateTakeHitAnimation = function() {
        if (!this.isTakingHit) return;

        let now = Date.now();
        if (now - this.lastTakeHitFrameTime > this.takeHitAnimationSpeed) {
            this.currentTakeHitFrame++;
            if (this.currentTakeHitFrame >= this.takeHitFrameCount) {
                this.isTakingHit = false;
                this.currentTakeHitFrame = 0;
            }
            this.lastTakeHitFrameTime = now;
        }
    };

    /**
     * Updates death animation frame cycling
     * @function updateDeathAnimation
     * @returns {void}
     */
    enemyClass.prototype.updateDeathAnimation = function() {
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
     * Advances attack animation frame and handles attack logic
     * @function advanceAttackFrame
     * @param {number} now - Current timestamp
     * @returns {void}
     */
    enemyClass.prototype.advanceAttackFrame = function(now) {
        this.currentAttackFrame++;

        if (this.currentAttackFrame === this.attackHitFrame && this.world) {
            this.dealDamageToCharacter();
        }

        if (this.currentAttackFrame >= this.attackFrameCount) {
            this.endAttackAnimation();
        }
        this.lastAttackFrameTime = now;
    };

    /**
     * Ends the attack animation and resets state
     * @function endAttackAnimation
     * @returns {void}
     */
    enemyClass.prototype.endAttackAnimation = function() {
        this.isAttacking = false;
        this.currentAttackFrame = 0;
    };
}

/**
 * Assigns shared combat functions to an enemy class
 * @function assignSharedCombatFunctions
 * @param {Function} enemyClass - The enemy class to assign functions to
 * @returns {void}
 */
function assignSharedCombatFunctions(enemyClass) {
    /**
     * Attempts to attack character if within range
     * @function tryAttack
     * @param {Character} character - The character to attack
     * @returns {void}
     */
    enemyClass.prototype.tryAttack = function(character) {
        if (this.isDead || this.isAttacking) return;

        let distance = Math.abs(this.x - character.x);
        let now = Date.now();

        if (distance <= this.attackRange && now - this.lastAttackTime >= this.attackCooldown) {
            this.isAttacking = true;
            this.currentAttackFrame = 0;
            this.lastAttackTime = now;
        }
    };

    /**
     * Plays take hit animation when enemy receives damage
     * @function playTakeHitAnimation
     * @returns {void}
     */
    enemyClass.prototype.playTakeHitAnimation = function() {
        if (this.isDead || this.isTakingHit) return;
        this.isTakingHit = true;
        this.currentTakeHitFrame = 0;
    };
}

/**
 * Assigns all shared functions to an enemy class
 * @function assignAllSharedFunctions
 * @param {Function} enemyClass - The enemy class to assign all functions to
 * @returns {void}
 */
function assignAllSharedFunctions(enemyClass) {
    assignSharedDrawingFunctions(enemyClass);
    assignSharedPatrolFunctions(enemyClass);
    assignSharedAnimationFunctions(enemyClass);
    assignSharedCombatFunctions(enemyClass);
}

assignAllSharedFunctions(Goblin);
assignAllSharedFunctions(Skeleton);
assignAllSharedFunctions(Mushroom);
