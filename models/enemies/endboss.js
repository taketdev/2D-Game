/**
 * Endboss AI, Combat, and Animation System
 * Contains AI behavior, combat logic, and animation updates
 */

// AI System
Endboss.prototype.updateAI = function() {
    setInterval(() => {
        // Check if game is paused
        if (this.world && this.world.isPaused) return;

        if (this.isDead) return;

        // Update Phase basierend auf HP
        this.updatePhase();

        // Update Aggro basierend auf Character-Distanz (wird von world.class.js gesetzt)
        this.updateMovement();
    }, 1000 / 60);
};

Endboss.prototype.updatePhase = function() {
    let hpPercentage = (this.currentHP / this.maxHP) * 100;

    if (hpPercentage <= 50) {
        // Phase 2: 50%-0% HP - Schnellere Bewegung
        this.speed = this.baseSpeed * this.phase2SpeedMultiplier;
    } else {
        // Phase 1: 100%-50% HP - Langsame Bewegung
        this.speed = this.baseSpeed;
    }
};

Endboss.prototype.updateMovement = function() {
    if (this.shouldStopMovement()) return;

    if (this.isAggro && this.isWalking) {
        this.moveTowardsTarget();
    }
};

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

Endboss.prototype.setAggro = function(character) {
    if (character.isDead) {
        this.deactivateAggro();
        return;
    }

    this.updateAggroState(character);
    this.updateWalkingState(character);
    this.targetCharacterX = character.x;
};

Endboss.prototype.deactivateAggro = function() {
    this.isAggro = false;
    this.isWalking = false;
};

Endboss.prototype.updateAggroState = function(character) {
    let distance = Math.abs(this.x - character.x);
    this.isAggro = distance <= this.aggroRange;
};

Endboss.prototype.updateWalkingState = function(character) {
    if (Math.abs(character.x - this.x) >= 50) {
        this.isWalking = this.isAggro;
    } else {
        this.isWalking = false;
    }
};

// Combat System
Endboss.prototype.tryAttack = function(character) {
    if (this.isDead || this.isAttacking2 || this.isAttacking3) return;

    let distance = Math.abs(this.x - character.x);
    if (distance <= this.attackRange) {
        this.executeRandomAttack();
    }
};

Endboss.prototype.executeRandomAttack = function() {
    let now = Date.now();
    let useAttack3 = Math.random() > 0.5;

    if (useAttack3 && this.canUseAttack3(now)) {
        this.startAttack3(now);
    } else if (!useAttack3 && this.canUseAttack2(now)) {
        this.startAttack2(now);
    }
};

Endboss.prototype.canUseAttack3 = function(now) {
    return now - this.lastAttack3Time >= this.attack3Cooldown;
};

Endboss.prototype.startAttack3 = function(now) {
    this.isAttacking3 = true;
    this.currentAttack3Frame = 0;
    this.lastAttack3Time = now;
};

Endboss.prototype.canUseAttack2 = function(now) {
    return now - this.lastAttack2Time >= this.attack2Cooldown;
};

Endboss.prototype.startAttack2 = function(now) {
    this.isAttacking2 = true;
    this.currentAttack2Frame = 0;
    this.lastAttack2Time = now;
};

// Schaden an Character zufügen bei Attack-Frame
Endboss.prototype.dealDamageToCharacter = function(damage) {
    if (!this.world || !this.world.character) return;

    let distance = Math.abs(this.x - this.world.character.x);

    // Prüfe ob Character noch in Reichweite ist
    if (distance <= this.attackRange + 30) { // +30px Toleranz
        this.world.character.takeAttackDamage(damage);
        console.log(`Endboss dealt ${damage} damage to character!`);
    }
};

Endboss.prototype.playTakeHitAnimation = function() {
    if (this.isDead || this.isTakingHit) return;
    this.isTakingHit = true;
    this.currentHitFrame = 0;
};

Endboss.prototype.die = function() {
    if (this.isDead) return;

    this.isDead = true;
    this.currentDeathFrame = 0;
    this.deathAnimationFinished = false;
    console.log('Endboss died!');
};

// Animation Updates
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

Endboss.prototype.updateAttack2Animation = function() {
    if (!this.isAttacking2) return;

    let now = Date.now();
    if (now - this.lastAttack2FrameTime > this.attack2AnimationSpeed) {
        this.advanceAttack2Frame(now);
    }
};

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

Endboss.prototype.endAttack2Animation = function() {
    this.isAttacking2 = false;
    this.currentAttack2Frame = 0;
};

Endboss.prototype.updateAttack3Animation = function() {
    if (!this.isAttacking3) return;

    let now = Date.now();
    if (now - this.lastAttack3FrameTime > this.attack3AnimationSpeed) {
        this.advanceAttack3Frame(now);
    }
};

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

Endboss.prototype.endAttack3Animation = function() {
    this.isAttacking3 = false;
    this.currentAttack3Frame = 0;
};

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
