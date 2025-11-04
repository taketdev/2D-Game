/**
 * Shared prototype functions for ground-based enemies (Goblin, Skeleton, Mushroom)
 * These functions are identical across all three enemy types
 */

// Drawing Functions (shared by Goblin, Skeleton, Mushroom)
function assignSharedDrawingFunctions(enemyClass) {
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

// Patrol/Movement Functions (shared by Goblin, Skeleton, Mushroom)
function assignSharedPatrolFunctions(enemyClass) {
    enemyClass.prototype.shouldSkipPatrol = function() {
        if (this.world && this.world.isPaused) return true;
        if (this.isDead) return true;
        if (this.isAttacking) return true;
        return false;
    };

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

// Animation Functions (shared by Goblin, Skeleton, Mushroom)
function assignSharedAnimationFunctions(enemyClass) {
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

    enemyClass.prototype.endAttackAnimation = function() {
        this.isAttacking = false;
        this.currentAttackFrame = 0;
    };
}

// Combat Functions (shared by Goblin, Skeleton, Mushroom)
function assignSharedCombatFunctions(enemyClass) {
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

    enemyClass.prototype.playTakeHitAnimation = function() {
        if (this.isDead || this.isTakingHit) return;
        this.isTakingHit = true;
        this.currentTakeHitFrame = 0;
    };
}

// Assign all shared functions to an enemy class
function assignAllSharedFunctions(enemyClass) {
    assignSharedDrawingFunctions(enemyClass);
    assignSharedPatrolFunctions(enemyClass);
    assignSharedAnimationFunctions(enemyClass);
    assignSharedCombatFunctions(enemyClass);
}

// Apply to all ground enemies
assignAllSharedFunctions(Goblin);
assignAllSharedFunctions(Skeleton);
assignAllSharedFunctions(Mushroom);
