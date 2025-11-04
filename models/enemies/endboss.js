/**
 * Endboss AI, Combat, and Animation System
 * Contains AI behavior, combat logic, and animation updates
 */

/**
 * Updates the endboss AI behavior including phase and movement
 * @function updateAI
 * @returns {void}
 */
Endboss.prototype.updateAI = function() {
    setInterval(() => {
        if (this.world && this.world.isPaused) return;

        if (this.isDead) return;

        this.updatePhase();

        this.updateMovement();
    }, 1000 / 60);
};

/**
 * Updates the endboss combat phase based on current HP percentage
 * @function updatePhase
 * @returns {void}
 */
Endboss.prototype.updatePhase = function() {
    let hpPercentage = (this.currentHP / this.maxHP) * 100;

    if (hpPercentage <= 50) {
        this.speed = this.baseSpeed * this.phase2SpeedMultiplier;
    } else {
        this.speed = this.baseSpeed;
    }
};

/**
 * Updates endboss movement based on aggro and walking state
 * @function updateMovement
 * @returns {void}
 */
Endboss.prototype.updateMovement = function() {
    if (this.shouldStopMovement()) return;

    if (this.isAggro && this.isWalking) {
        this.moveTowardsTarget();
    }
};

/**
 * Checks if movement should be stopped due to attacks or character death
 * @function shouldStopMovement
 * @returns {boolean} True if movement should stop
 */
Endboss.prototype.shouldStopMovement = function() {
    if (this.isAttacking2 || this.isAttacking3) {
        this.isWalking = false;
        return true;
    }

    if (this.world && this.world.character && this.world.character.isDead) {
        this.isWalking = false;
        return true;
    }

    return false;
};

/**
 * Moves the endboss towards the target character
 * @function moveTowardsTarget
 * @returns {void}
 */
Endboss.prototype.moveTowardsTarget = function() {
    let distanceToTarget = this.targetCharacterX - this.x;
    let absDistance = Math.abs(distanceToTarget);

    if (absDistance < 50) {
        this.isWalking = false;
        return;
    }

    if (distanceToTarget < 0) {
        this.x -= this.speed;
        this.otherDirection = false;
    } else {
        this.x += this.speed;
        this.otherDirection = true;
    }
};

/**
 * Sets aggro state and walking behavior based on character position
 * @function setAggro
 * @param {Object} character - The character object to target
 * @returns {void}
 */
Endboss.prototype.setAggro = function(character) {
    if (character.isDead) {
        this.deactivateAggro();
        return;
    }

    this.updateAggroState(character);
    this.updateWalkingState(character);
    this.targetCharacterX = character.x;
};

/**
 * Deactivates aggro and walking state
 * @function deactivateAggro
 * @returns {void}
 */
Endboss.prototype.deactivateAggro = function() {
    this.isAggro = false;
    this.isWalking = false;
};

/**
 * Updates aggro state based on distance to character
 * @function updateAggroState
 * @param {Object} character - The character object to check distance to
 * @returns {void}
 */
Endboss.prototype.updateAggroState = function(character) {
    let distance = Math.abs(this.x - character.x);
    this.isAggro = distance <= this.aggroRange;
};

/**
 * Updates walking state based on distance to character
 * @function updateWalkingState
 * @param {Object} character - The character object to check distance to
 * @returns {void}
 */
Endboss.prototype.updateWalkingState = function(character) {
    if (Math.abs(character.x - this.x) >= 50) {
        this.isWalking = this.isAggro;
    } else {
        this.isWalking = false;
    }
};

/**
 * Attempts to attack the character if within range
 * @function tryAttack
 * @param {Object} character - The character to potentially attack
 * @returns {void}
 */
Endboss.prototype.tryAttack = function(character) {
    if (this.isDead || this.isAttacking2 || this.isAttacking3) return;

    let distance = Math.abs(this.x - character.x);
    if (distance <= this.attackRange) {
        this.executeRandomAttack();
    }
};

/**
 * Executes a random attack (attack 2 or attack 3)
 * @function executeRandomAttack
 * @returns {void}
 */
Endboss.prototype.executeRandomAttack = function() {
    let now = Date.now();
    let useAttack3 = Math.random() > 0.5;

    if (useAttack3 && this.canUseAttack3(now)) {
        this.startAttack3(now);
    } else if (!useAttack3 && this.canUseAttack2(now)) {
        this.startAttack2(now);
    }
};

/**
 * Checks if attack 3 can be used based on cooldown
 * @function canUseAttack3
 * @param {number} now - Current timestamp
 * @returns {boolean} True if attack 3 is available
 */
Endboss.prototype.canUseAttack3 = function(now) {
    return now - this.lastAttack3Time >= this.attack3Cooldown;
};

/**
 * Starts attack 3 animation and sets state
 * @function startAttack3
 * @param {number} now - Current timestamp
 * @returns {void}
 */
Endboss.prototype.startAttack3 = function(now) {
    this.isAttacking3 = true;
    this.currentAttack3Frame = 0;
    this.lastAttack3Time = now;
};

/**
 * Checks if attack 2 can be used based on cooldown
 * @function canUseAttack2
 * @param {number} now - Current timestamp
 * @returns {boolean} True if attack 2 is available
 */
Endboss.prototype.canUseAttack2 = function(now) {
    return now - this.lastAttack2Time >= this.attack2Cooldown;
};

/**
 * Starts attack 2 animation and sets state
 * @function startAttack2
 * @param {number} now - Current timestamp
 * @returns {void}
 */
Endboss.prototype.startAttack2 = function(now) {
    this.isAttacking2 = true;
    this.currentAttack2Frame = 0;
    this.lastAttack2Time = now;
};

/**
 * Deals damage to the character if within attack range
 * @function dealDamageToCharacter
 * @param {number} damage - Amount of damage to deal
 * @returns {void}
 */
Endboss.prototype.dealDamageToCharacter = function(damage) {
    if (!this.world || !this.world.character) return;

    let distance = Math.abs(this.x - this.world.character.x);

    if (distance <= this.attackRange + 30) {
        this.world.character.takeAttackDamage(damage);
        console.log(`Endboss dealt ${damage} damage to character!`);
    }
};

/**
 * Triggers the take hit animation if not already playing
 * @function playTakeHitAnimation
 * @returns {void}
 */
Endboss.prototype.playTakeHitAnimation = function() {
    if (this.isDead || this.isTakingHit) return;
    this.isTakingHit = true;
    this.currentHitFrame = 0;
};

/**
 * Handles endboss death and starts death animation
 * @function die
 * @returns {void}
 */
Endboss.prototype.die = function() {
    if (this.isDead) return;

    this.isDead = true;
    this.currentDeathFrame = 0;
    this.deathAnimationFinished = false;
    console.log('Endboss died!');
};

/**
 * Updates idle animation frame cycling
 * @function updateIdleAnimation
 * @returns {void}
 */
Endboss.prototype.updateIdleAnimation = function() {
    let now = Date.now();
    if (now - this.lastIdleFrameTime > this.idleAnimationSpeed) {
        this.currentIdleFrame++;
        if (this.currentIdleFrame >= this.idleFrameCount) {
            this.currentIdleFrame = 0;
        }
        this.lastIdleFrameTime = now;
    }
};

/**
 * Updates walking animation frame cycling
 * @function updateWalkAnimation
 * @returns {void}
 */
Endboss.prototype.updateWalkAnimation = function() {
    let now = Date.now();
    if (now - this.lastWalkFrameTime > this.walkAnimationSpeed) {
        this.currentWalkFrame++;
        if (this.currentWalkFrame >= this.walkFrameCount) {
            this.currentWalkFrame = 0;
        }
        this.lastWalkFrameTime = now;
    }
};

/**
 * Updates hit animation and manages animation completion
 * @function updateHitAnimation
 * @returns {void}
 */
Endboss.prototype.updateHitAnimation = function() {
    if (!this.isTakingHit) return;

    let now = Date.now();
    if (now - this.lastHitFrameTime > this.hitAnimationSpeed) {
        this.currentHitFrame++;
        if (this.currentHitFrame >= this.hitFrameCount) {
            this.isTakingHit = false;
            this.currentHitFrame = 0;
        }
        this.lastHitFrameTime = now;
    }
};

/**
 * Updates attack 2 animation and handles damage timing
 * @function updateAttack2Animation
 * @returns {void}
 */
Endboss.prototype.updateAttack2Animation = function() {
    if (!this.isAttacking2) return;

    let now = Date.now();
    if (now - this.lastAttack2FrameTime > this.attack2AnimationSpeed) {
        this.advanceAttack2Frame(now);
    }
};

/**
 * Advances attack 2 animation frame and handles damage timing
 * @function advanceAttack2Frame
 * @param {number} now - Current timestamp
 * @returns {void}
 */
Endboss.prototype.advanceAttack2Frame = function(now) {
    this.currentAttack2Frame++;

    if (this.currentAttack2Frame === this.attack2HitFrame && this.world) {
        this.dealDamageToCharacter(CONFIG.DAMAGE.ENDBOSS_ATTACK2);
    }

    if (this.currentAttack2Frame >= this.attack2FrameCount) {
        this.endAttack2Animation();
    }
    this.lastAttack2FrameTime = now;
};

/**
 * Ends attack 2 animation and resets state
 * @function endAttack2Animation
 * @returns {void}
 */
Endboss.prototype.endAttack2Animation = function() {
    this.isAttacking2 = false;
    this.currentAttack2Frame = 0;
};

/**
 * Updates attack 3 animation and handles damage timing
 * @function updateAttack3Animation
 * @returns {void}
 */
Endboss.prototype.updateAttack3Animation = function() {
    if (!this.isAttacking3) return;

    let now = Date.now();
    if (now - this.lastAttack3FrameTime > this.attack3AnimationSpeed) {
        this.advanceAttack3Frame(now);
    }
};

/**
 * Advances attack 3 animation frame and handles damage timing
 * @function advanceAttack3Frame
 * @param {number} now - Current timestamp
 * @returns {void}
 */
Endboss.prototype.advanceAttack3Frame = function(now) {
    this.currentAttack3Frame++;

    if (this.currentAttack3Frame === this.attack3HitFrame && this.world) {
        this.dealDamageToCharacter(CONFIG.DAMAGE.ENDBOSS_ATTACK3);
    }

    if (this.currentAttack3Frame >= this.attack3FrameCount) {
        this.endAttack3Animation();
    }
    this.lastAttack3FrameTime = now;
};

/**
 * Ends attack 3 animation and resets state
 * @function endAttack3Animation
 * @returns {void}
 */
Endboss.prototype.endAttack3Animation = function() {
    this.isAttacking3 = false;
    this.currentAttack3Frame = 0;
};

/**
 * Updates death animation and manages completion state
 * @function updateDeathAnimation
 * @returns {void}
 */
Endboss.prototype.updateDeathAnimation = function() {
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
