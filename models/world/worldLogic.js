/**
 * World Logic System
 * Contains collision detection, spawning, and game state management
 */

/**
 * Starts the collision detection system with regular interval checks
 * @function checkCollisions
 * @returns {void}
 */
World.prototype.checkCollisions = function() {
    this.collisionCheckIntervalId = setInterval(() => {
        if (this.isPaused) return;

        this.checkEnemyCollisions();
        this.checkProjectileCollisions();
        this.checkCollectibleCollisions();
        this.updateEnemyDirections();
        this.cleanupProjectiles();
        this.checkEndbossSpawn();
        this.checkGameOver();
        this.checkVictory();
    }, 1000 / 60);
};

/**
 * Checks collisions between character and enemies and applies pushback
 * @function checkEnemyCollisions
 * @returns {void}
 */
World.prototype.checkEnemyCollisions = function() {
    this.level.enemies.forEach(enemy => {
        if (enemy.isDead) return;

        if (this.character.isColliding(enemy)) {
            this.character.applyPushback(enemy.x);
        }
    });
};

/**
 * Checks collisions between projectiles and enemies
 * @function checkProjectileCollisions
 * @returns {void}
 */
World.prototype.checkProjectileCollisions = function() {
    this.projectiles.forEach(projectile => {
        if (projectile.hasHit) return;
        this.checkProjectileAgainstEnemies(projectile);
    });
};

/**
 * Checks if a specific projectile collides with any enemy
 * @function checkProjectileAgainstEnemies
 * @param {Object} projectile - The projectile to check for collisions
 * @returns {void}
 */
World.prototype.checkProjectileAgainstEnemies = function(projectile) {
    this.level.enemies.forEach(enemy => {
        if (enemy.isDead) return;
        if (projectile.isColliding(enemy)) {
            this.handleProjectileHit(projectile, enemy);
        }
    });
};

/**
 * Handles what happens when a projectile hits an enemy
 * @function handleProjectileHit
 * @param {Object} projectile - The projectile that hit
 * @param {Object} enemy - The enemy that was hit
 * @returns {void}
 */
World.prototype.handleProjectileHit = function(projectile, enemy) {
    enemy.takeDamage(projectile.damage);
    projectile.hit();
};

/**
 * Checks collisions between character and collectible items
 * @function checkCollectibleCollisions
 * @returns {void}
 */
World.prototype.checkCollectibleCollisions = function() {
    if (!this.level.collectibles) return;

    this.level.collectibles.forEach(collectible => {
        if (collectible.collected) return;

        if (this.character.isColliding(collectible)) {
            this.collectItem(collectible);
        }
    });
};

/**
 * Handles collection of an item by the character
 * @function collectItem
 * @param {Object} collectible - The collectible item to be collected
 * @returns {void}
 */
World.prototype.collectItem = function(collectible) {
    collectible.collected = true;
    this.restoreHealth(collectible.healthRestore);
    this.restoreMana(collectible.manaRestore);
    this.logCollectionStats();
};

/**
 * Restores health to the character up to maximum health
 * @function restoreHealth
 * @param {number} amount - Amount of health to restore
 * @returns {void}
 */
World.prototype.restoreHealth = function(amount) {
    this.character.currentHP += amount;
    if (this.character.currentHP > this.character.maxHP) {
        this.character.currentHP = this.character.maxHP;
    }
};

/**
 * Restores mana to the character up to maximum mana
 * @function restoreMana
 * @param {number} amount - Amount of mana to restore
 * @returns {void}
 */
World.prototype.restoreMana = function(amount) {
    this.character.currentMana += amount;
    if (this.character.currentMana > this.character.maxMana) {
        this.character.currentMana = this.character.maxMana;
    }
};

/**
 * Logs collection statistics (placeholder function)
 * @function logCollectionStats
 * @returns {void}
 */
World.prototype.logCollectionStats = function() {
};

/**
 * Updates enemy directions and behavior based on character position
 * @function updateEnemyDirections
 * @returns {void}
 */
World.prototype.updateEnemyDirections = function() {
    this.level.enemies.forEach(enemy => {
        if (enemy.isDead) return;

        if (enemy.setAggro) {
            enemy.setAggro(this.character);
        }

        if (enemy.tryAttack) {
            enemy.tryAttack(this.character);
        }

        if (enemy.turnTowardsCharacter) {
            if (this.character.x < enemy.x) {
                enemy.otherDirection = true;
            } else {
                enemy.otherDirection = false;
            }
        }
    });
};

/**
 * Starts the scroll spawning system with initial scrolls and periodic checks
 * @function startScrollSpawning
 * @returns {void}
 */
World.prototype.startScrollSpawning = function() {
    this.spawnInitialScrolls();

    this.scrollSpawnIntervalId = setInterval(() => {
        this.checkScrollSpawn();
    }, 2000);
};

/**
 * Spawns the initial set of scrolls on the map
 * @function spawnInitialScrolls
 * @returns {void}
 */
World.prototype.spawnInitialScrolls = function() {
    for (let i = 0; i < this.maxScrollsOnMap; i++) {
        this.spawnScroll();
    }
};

/**
 * Checks if new scrolls need to be spawned and spawns them if conditions are met
 * @function checkScrollSpawn
 * @returns {void}
 */
World.prototype.checkScrollSpawn = function() {
    let activeScrolls = this.getActiveScrollCount();

    if (activeScrolls < this.maxScrollsOnMap) {
        let now = Date.now();
        if (now - this.lastScrollSpawnTime >= this.scrollSpawnCooldown) {
            this.spawnScroll();
            this.lastScrollSpawnTime = now;
        }
    }
};

/**
 * Gets the count of active (uncollected) scrolls on the map
 * @function getActiveScrollCount
 * @returns {number} Number of active scrolls
 */
World.prototype.getActiveScrollCount = function() {
    if (!this.level.collectibles) return 0;
    return this.level.collectibles.filter(scroll => !scroll.collected).length;
};

/**
 * Spawns a new scroll at a random location on the map
 * @function spawnScroll
 * @returns {void}
 */
World.prototype.spawnScroll = function() {
    let levelWidth = this.level.level_end_x;
    let groundY = 335;
    let randomX = Math.random() * (levelWidth - 400) + 200;

    let newScroll = new Scroll(randomX, groundY);
    this.level.collectibles.push(newScroll);
};

/**
 * Checks if the endboss should be spawned based on character position
 * @function checkEndbossSpawn
 * @returns {void}
 */
World.prototype.checkEndbossSpawn = function() {
    if (!this.endbossSpawned && this.character.x >= this.endbossSpawnX) {
        this.spawnEndboss();
    }
};

/**
 * Spawns the endboss and adds it to the level enemies
 * @function spawnEndboss
 * @returns {void}
 */
World.prototype.spawnEndboss = function() {
    let endboss = new Endboss();
    endboss.world = this;
    this.level.enemies.push(endboss);
    this.endbossSpawned = true;
};

/**
 * Checks if game over conditions are met and triggers game over sequence
 * @function checkGameOver
 * @returns {void}
 */
World.prototype.checkGameOver = function() {
    if (this.character.isDead && this.character.deathAnimationFinished && !this.gameOverTriggered) {
        this.gameOverTriggered = true;
        setTimeout(() => {
            this.triggerGameOver();
        }, 500);
    }
};

/**
 * Triggers the game over screen display
 * @function triggerGameOver
 * @returns {void}
 */
World.prototype.triggerGameOver = function() {
    if (typeof menu !== 'undefined' && menu) {
        menu.showGameOver();
    }
};

/**
 * Checks if victory conditions are met and triggers victory sequence
 * @function checkVictory
 * @returns {void}
 */
World.prototype.checkVictory = function() {
    let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);

    if (endboss && endboss.isDead && endboss.deathAnimationFinished && !this.victoryTriggered) {
        this.victoryTriggered = true;
        setTimeout(() => {
            this.triggerVictory();
        }, 500);
    }
};

/**
 * Triggers the victory screen display
 * @function triggerVictory
 * @returns {void}
 */
World.prototype.triggerVictory = function() {
    if (typeof menu !== 'undefined' && menu) {
        menu.showVictory();
    }
};
