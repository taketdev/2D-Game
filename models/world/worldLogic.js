/**
 * World Logic System
 * Contains collision detection, spawning, and game state management
 */

// Collision Detection System
World.prototype.checkCollisions = function() {
    this.collisionCheckIntervalId = setInterval(() => {
        if (this.isPaused) return; // Skip updates when paused

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

World.prototype.checkEnemyCollisions = function() {
    this.level.enemies.forEach(enemy => {
        if (enemy.isDead) return; // Tote Enemies ignorieren

        if (this.character.isColliding(enemy)) {
            // Nur sanftes Wegschieben bei Kontakt, KEIN Schaden
            this.character.applyPushback(enemy.x);
        }
    });
};

World.prototype.checkProjectileCollisions = function() {
    this.projectiles.forEach(projectile => {
        if (projectile.hasHit) return;
        this.checkProjectileAgainstEnemies(projectile);
    });
};

World.prototype.checkProjectileAgainstEnemies = function(projectile) {
    this.level.enemies.forEach(enemy => {
        if (enemy.isDead) return;
        if (projectile.isColliding(enemy)) {
            this.handleProjectileHit(projectile, enemy);
        }
    });
};

World.prototype.handleProjectileHit = function(projectile, enemy) {
    enemy.takeDamage(projectile.damage);
    projectile.hit();
};

World.prototype.checkCollectibleCollisions = function() {
    if (!this.level.collectibles) return;

    this.level.collectibles.forEach(collectible => {
        if (collectible.collected) return; // Bereits eingesammelt

        if (this.character.isColliding(collectible)) {
            // Character hat Collectible eingesammelt
            this.collectItem(collectible);
        }
    });
};

World.prototype.collectItem = function(collectible) {
    collectible.collected = true;
    this.restoreHealth(collectible.healthRestore);
    this.restoreMana(collectible.manaRestore);
    this.logCollectionStats();
};

World.prototype.restoreHealth = function(amount) {
    this.character.currentHP += amount;
    if (this.character.currentHP > this.character.maxHP) {
        this.character.currentHP = this.character.maxHP;
    }
};

World.prototype.restoreMana = function(amount) {
    this.character.currentMana += amount;
    if (this.character.currentMana > this.character.maxMana) {
        this.character.currentMana = this.character.maxMana;
    }
};

World.prototype.logCollectionStats = function() {
};

World.prototype.updateEnemyDirections = function() {
    this.level.enemies.forEach(enemy => {
        if (enemy.isDead) return;

        // Update Aggro für Enemies mit Aggro-System
        if (enemy.setAggro) {
            enemy.setAggro(this.character);
        }

        // Attack-Trigger für Enemies mit Attack-System
        if (enemy.tryAttack) {
            enemy.tryAttack(this.character);
        }

        // turnTowardsCharacter nur für Flying Eye (andere steuern Direction selbst)
        if (enemy.turnTowardsCharacter) {
            if (this.character.x < enemy.x) {
                enemy.otherDirection = true; // Schaut nach links
            } else {
                enemy.otherDirection = false; // Schaut nach rechts
            }
        }
    });
};

// Scroll Spawn System
World.prototype.startScrollSpawning = function() {
    // Spawne initial 3 Scrolls
    this.spawnInitialScrolls();

    // Prüfe alle 2 Sekunden ob neue Scrolls gespawnt werden müssen
    this.scrollSpawnIntervalId = setInterval(() => {
        this.checkScrollSpawn();
    }, 2000);
};

World.prototype.spawnInitialScrolls = function() {
    for (let i = 0; i < this.maxScrollsOnMap; i++) {
        this.spawnScroll();
    }
};

World.prototype.checkScrollSpawn = function() {
    let activeScrolls = this.getActiveScrollCount();

    // Spawne neuen Scroll wenn weniger als max und Cooldown abgelaufen
    if (activeScrolls < this.maxScrollsOnMap) {
        let now = Date.now();
        if (now - this.lastScrollSpawnTime >= this.scrollSpawnCooldown) {
            this.spawnScroll();
            this.lastScrollSpawnTime = now;
        }
    }
};

World.prototype.getActiveScrollCount = function() {
    if (!this.level.collectibles) return 0;
    return this.level.collectibles.filter(scroll => !scroll.collected).length;
};

World.prototype.spawnScroll = function() {
    let levelWidth = this.level.level_end_x;
    let groundY = 335;
    let randomX = Math.random() * (levelWidth - 400) + 200; // Zwischen 200 und 1800

    let newScroll = new Scroll(randomX, groundY);
    this.level.collectibles.push(newScroll);
};

// Endboss Spawn System
World.prototype.checkEndbossSpawn = function() {
    // Spawne Endboss nur einmal, wenn Character Battleground2 erreicht
    if (!this.endbossSpawned && this.character.x >= this.endbossSpawnX) {
        this.spawnEndboss();
    }
};

World.prototype.spawnEndboss = function() {
    let endboss = new Endboss();
    endboss.world = this;
    this.level.enemies.push(endboss);
    this.endbossSpawned = true;
};

// Game State Management
World.prototype.checkGameOver = function() {
    // Check if character is dead and death animation is finished
    if (this.character.isDead && this.character.deathAnimationFinished && !this.gameOverTriggered) {
        this.gameOverTriggered = true;
        // Add small delay to ensure death animation is fully visible
        setTimeout(() => {
            this.triggerGameOver();
        }, 500); // 500ms delay
    }
};

World.prototype.triggerGameOver = function() {
    // Show game over screen via menu (don't cleanup yet, keep game visible but darkened)
    if (typeof menu !== 'undefined' && menu) {
        menu.showGameOver();
    }
};

World.prototype.checkVictory = function() {
    // Check if endboss exists and is dead with finished death animation
    let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);

    if (endboss && endboss.isDead && endboss.deathAnimationFinished && !this.victoryTriggered) {
        this.victoryTriggered = true;
        // Add small delay to ensure death animation is fully visible
        setTimeout(() => {
            this.triggerVictory();
        }, 500); // 500ms delay
    }
};

World.prototype.triggerVictory = function() {
    // Show victory screen via menu (don't cleanup yet, keep game visible but darkened)
    if (typeof menu !== 'undefined' && menu) {
        menu.showVictory();
    }
};
