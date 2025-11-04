/**
 * Character Combat System
 * Contains all combat-related functions (attacks, damage, mana)
 */

/**
 * Handles attack input from keyboard and manages cooldowns
 * @function handleAttackInput
 * @returns {void}
 */
Character.prototype.handleAttackInput = function() {
    if (this.world.keyboard.D && !this.isAttacking1 && !this.isAttacking2) {
        let now = Date.now();
        if (now - this.lastAttack1Time >= this.attack1Cooldown) {
            this.attack1();
            this.lastAttack1Time = now;
        }
    }

    if (this.world.keyboard.E && !this.isAttacking1 && !this.isAttacking2) {
        let now = Date.now();
        if (now - this.lastAttack2Time >= this.attack2Cooldown) {
            this.attack2();
            this.lastAttack2Time = now;
        }
    }
};

/**
 * Initiates attack 1 with mana consumption and state management
 * @function attack1
 * @returns {void}
 */
Character.prototype.attack1 = function() {
    if (this.isAttacking1 || this.isAttacking2) return;
    if (!this.hasMana()) return;

    this.useMana();
    this.isAttacking1 = true;
    this.currentAttack1Frame = 0;
    this.attack1ProjectileSpawned = false;
};

/**
 * Initiates attack 2 with mana consumption and state management
 * @function attack2
 * @returns {void}
 */
Character.prototype.attack2 = function() {
    if (this.isAttacking1 || this.isAttacking2) return;
    if (!this.hasMana()) return;

    this.useMana();
    this.isAttacking2 = true;
    this.currentAttack2Frame = 0;
    this.attack2ProjectileSpawned = false;
};

/**
 * Spawns a projectile with specified type and damage
 * @function spawnProjectile
 * @param {number} type - Type of projectile (1 or 2)
 * @returns {void}
 */
Character.prototype.spawnProjectile = function(type) {
    if (!this.world) return;

    let damage = this.calculateProjectileDamage(type);
    let { projectileX, projectileY, direction } = this.calculateProjectileSpawnData();

    let projectile = new Projectile(projectileX, projectileY, direction, type, damage);
    projectile.world = this.world;
    this.world.addProjectile(projectile);
};

/**
 * Calculates damage value based on projectile type
 * @function calculateProjectileDamage
 * @param {number} type - Type of projectile (1 or 2)
 * @returns {number} Damage amount
 */
Character.prototype.calculateProjectileDamage = function(type) {
    return type === 1 ? 15 : 25;
};

/**
 * Calculates projectile spawn position and direction based on character orientation
 * @function calculateProjectileSpawnData
 * @returns {Object} Object containing projectileX, projectileY, and direction
 */
Character.prototype.calculateProjectileSpawnData = function() {
    let projectileX = this.otherDirection ? this.x + 20 : this.x + this.width - 60;
    let projectileY = this.y + 60;
    let direction = this.otherDirection ? -1 : 1;
    return { projectileX, projectileY, direction };
};

/**
 * Handles damage from enemy attacks with invulnerability frames
 * @function takeAttackDamage
 * @param {number} damage - Amount of damage to apply
 * @returns {void}
 */
Character.prototype.takeAttackDamage = function(damage) {
    if (this.invulnerable || this.isDead) return;

    this.takeDamage(damage);
    this.invulnerable = true;

    setTimeout(() => {
        this.invulnerable = false;
    }, this.invulnerableTime);
};

/**
 * Triggers hit animation if character is not dead or already hurt
 * @function playTakeHitAnimation
 * @returns {void}
 */
Character.prototype.playTakeHitAnimation = function() {
    if (this.isDead || this.isHurt) return;
    this.isHurt = true;
    this.currentHurtFrame = 0;
};

/**
 * Handles character death and stops movement while preserving death animation
 * @function die
 * @returns {void}
 */
Character.prototype.die = function() {
    if (this.isDead) return;

    this.isDead = true;
    this.currentDeathFrame = 0;
    this.deathAnimationFinished = false;
    console.log('Character died!');

    if (this.movementIntervalId) {
        clearInterval(this.movementIntervalId);
        this.movementIntervalId = null;
    }
};

/**
 * Checks if character has enough mana for spell casting
 * @function hasMana
 * @returns {boolean} True if character has sufficient mana
 */
Character.prototype.hasMana = function() {
    return this.currentMana >= this.manaCostPerSpell;
};

/**
 * Consumes mana for spell casting and logs current mana
 * @function useMana
 * @returns {void}
 */
Character.prototype.useMana = function() {
    if (this.currentMana >= this.manaCostPerSpell) {
        this.currentMana -= this.manaCostPerSpell;
        console.log(`Mana used. Current Mana: ${this.currentMana}/${this.maxMana}`);
    }
};

/**
 * Regenerates mana over time if character is alive and not at maximum
 * @function regenerateMana
 * @returns {void}
 */
Character.prototype.regenerateMana = function() {
    if (this.isDead) return;

    if (this.currentMana < this.maxMana) {
        this.currentMana += this.manaRegenRate;

        if (this.currentMana > this.maxMana) {
            this.currentMana = this.maxMana;
        }
    }
};

/**
 * Starts the mana regeneration loop with pause handling
 * @function startManaRegenerationLoop
 * @returns {void}
 */
Character.prototype.startManaRegenerationLoop = function() {
    this.manaRegenIntervalId = setInterval(() => {
        if (this.world && this.world.isPaused) return;

        this.regenerateMana();
    }, 1000);
};
