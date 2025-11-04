/**
 * Character Combat System
 * Contains all combat-related functions (attacks, damage, mana)
 */

// Attack Input Handling
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

// Attack Functions
Character.prototype.attack1 = function() {
    if (this.isAttacking1 || this.isAttacking2) return;
    if (!this.hasMana()) return; // Prüfe Mana

    this.useMana(); // Verbrauche Mana
    this.isAttacking1 = true;
    this.currentAttack1Frame = 0;
    this.attack1ProjectileSpawned = false;
};

Character.prototype.attack2 = function() {
    if (this.isAttacking1 || this.isAttacking2) return;
    if (!this.hasMana()) return; // Prüfe Mana

    this.useMana(); // Verbrauche Mana
    this.isAttacking2 = true;
    this.currentAttack2Frame = 0;
    this.attack2ProjectileSpawned = false;
};

// Projectile Spawning
Character.prototype.spawnProjectile = function(type) {
    if (!this.world) return;

    let damage = this.calculateProjectileDamage(type);
    let { projectileX, projectileY, direction } = this.calculateProjectileSpawnData();

    let projectile = new Projectile(projectileX, projectileY, direction, type, damage);
    projectile.world = this.world;
    this.world.addProjectile(projectile);
};

Character.prototype.calculateProjectileDamage = function(type) {
    return type === 1 ? 15 : 25;
};

Character.prototype.calculateProjectileSpawnData = function() {
    let projectileX = this.otherDirection ? this.x + 20 : this.x + this.width - 60;
    let projectileY = this.y + 60;
    let direction = this.otherDirection ? -1 : 1;
    return { projectileX, projectileY, direction };
};

// Damage System
Character.prototype.takeAttackDamage = function(damage) {
    if (this.invulnerable || this.isDead) return;

    this.takeDamage(damage);
    this.invulnerable = true;

    // Unverwundbarkeit nach 1 Sekunde beenden
    setTimeout(() => {
        this.invulnerable = false;
    }, this.invulnerableTime);
};

Character.prototype.playTakeHitAnimation = function() {
    if (this.isDead || this.isHurt) return;
    this.isHurt = true;
    this.currentHurtFrame = 0;
};

Character.prototype.die = function() {
    if (this.isDead) return;

    this.isDead = true;
    this.currentDeathFrame = 0;
    this.deathAnimationFinished = false;
    console.log('Character died!');

    // DON'T cleanup intervals yet - let death animation finish first
    // Only stop movement
    if (this.movementIntervalId) {
        clearInterval(this.movementIntervalId);
        this.movementIntervalId = null;
    }
};

// Mana System
Character.prototype.hasMana = function() {
    return this.currentMana >= this.manaCostPerSpell;
};

Character.prototype.useMana = function() {
    if (this.currentMana >= this.manaCostPerSpell) {
        this.currentMana -= this.manaCostPerSpell;
        console.log(`Mana used. Current Mana: ${this.currentMana}/${this.maxMana}`);
    }
};

Character.prototype.regenerateMana = function() {
    if (this.isDead) return; // Keine Regeneration wenn tot

    if (this.currentMana < this.maxMana) {
        this.currentMana += this.manaRegenRate;

        // Verhindere dass Mana über Maximum geht
        if (this.currentMana > this.maxMana) {
            this.currentMana = this.maxMana;
        }
    }
};

Character.prototype.startManaRegenerationLoop = function() {
    this.manaRegenIntervalId = setInterval(() => {
        if (this.world && this.world.isPaused) return;

        this.regenerateMana();
    }, 1000);
};
