class World {
    // Game Objects
    character = new Character();
    level = createLevel1(); // Create fresh level instance
    projectiles = []; // Array für alle Projektile

    // HUD Elements
    healthBar = new HealthBar(20, 10);
    manaBar = new ManaBar(20, 10);
    bossHealthBar = new BossHealthBar(300, 10); // Mittig (720/2 - 120/2 = 300)

    // Canvas Properties
    canvas;
    ctx;
    keyboard;
    camera_x = -100;

    // Collectible Spawn System
    maxScrollsOnMap = 3;
    scrollSpawnCooldown = 10000; // 10 Sekunden Cooldown
    lastScrollSpawnTime = 0;

    // Endboss Spawn System
    endbossSpawned = false;
    endbossSpawnX = 3600; // Battleground2 startet bei x=3600

    // Game Over System
    gameOverTriggered = false;
    victoryTriggered = false;

    // Pause System
    isPaused = false;

    // Interval IDs für Cleanup
    scrollSpawnIntervalId;
    collisionCheckIntervalId;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.checkCollisions();
        this.startScrollSpawning();
    }

    startScrollSpawning() {
        // Spawne initial 3 Scrolls
        this.spawnInitialScrolls();

        // Prüfe alle 2 Sekunden ob neue Scrolls gespawnt werden müssen
        this.scrollSpawnIntervalId = setInterval(() => {
            this.checkScrollSpawn();
        }, 2000);
    }

    spawnInitialScrolls() {
        for (let i = 0; i < this.maxScrollsOnMap; i++) {
            this.spawnScroll();
        }
    }

    checkScrollSpawn() {
        let activeScrolls = this.getActiveScrollCount();

        // Spawne neuen Scroll wenn weniger als max und Cooldown abgelaufen
        if (activeScrolls < this.maxScrollsOnMap) {
            let now = Date.now();
            if (now - this.lastScrollSpawnTime >= this.scrollSpawnCooldown) {
                this.spawnScroll();
                this.lastScrollSpawnTime = now;
            }
        }
    }

    getActiveScrollCount() {
        if (!this.level.collectibles) return 0;
        return this.level.collectibles.filter(scroll => !scroll.collected).length;
    }

    spawnScroll() {
        let levelWidth = this.level.level_end_x;
        let groundY = 335;
        let randomX = Math.random() * (levelWidth - 400) + 200; // Zwischen 200 und 1800

        let newScroll = new Scroll(randomX, groundY);
        this.level.collectibles.push(newScroll);
    }

    setWorld() {
        this.character.world = this;

        // Setze World-Referenz für alle Enemies
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }

    checkCollisions() {
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
    }

    checkEndbossSpawn() {
        // Spawne Endboss nur einmal, wenn Character Battleground2 erreicht
        if (!this.endbossSpawned && this.character.x >= this.endbossSpawnX) {
            this.spawnEndboss();
        }
    }

    spawnEndboss() {
        let endboss = new Endboss();
        endboss.world = this;
        this.level.enemies.push(endboss);
        this.endbossSpawned = true;
        console.log('Endboss spawned at x=' + endboss.x);
    }

    updateEnemyDirections() {
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
    }

    checkEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (enemy.isDead) return; // Tote Enemies ignorieren

            if (this.character.isColliding(enemy)) {
                // Nur sanftes Wegschieben bei Kontakt, KEIN Schaden
                this.character.applyPushback(enemy.x);
            }
        });
    }

    checkProjectileCollisions() {
        this.projectiles.forEach(projectile => {
            if (projectile.hasHit) return;
            this.checkProjectileAgainstEnemies(projectile);
        });
    }

    checkProjectileAgainstEnemies(projectile) {
        this.level.enemies.forEach(enemy => {
            if (enemy.isDead) return;
            if (projectile.isColliding(enemy)) {
                this.handleProjectileHit(projectile, enemy);
            }
        });
    }

    handleProjectileHit(projectile, enemy) {
        enemy.takeDamage(projectile.damage);
        projectile.hit();
    }

    checkCollectibleCollisions() {
        if (!this.level.collectibles) return;

        this.level.collectibles.forEach(collectible => {
            if (collectible.collected) return; // Bereits eingesammelt

            if (this.character.isColliding(collectible)) {
                // Character hat Collectible eingesammelt
                this.collectItem(collectible);
            }
        });
    }

    collectItem(collectible) {
        collectible.collected = true;
        this.restoreHealth(collectible.healthRestore);
        this.restoreMana(collectible.manaRestore);
        this.logCollectionStats();
    }

    restoreHealth(amount) {
        this.character.currentHP += amount;
        if (this.character.currentHP > this.character.maxHP) {
            this.character.currentHP = this.character.maxHP;
        }
    }

    restoreMana(amount) {
        this.character.currentMana += amount;
        if (this.character.currentMana > this.character.maxMana) {
            this.character.currentMana = this.character.maxMana;
        }
    }

    logCollectionStats() {
        console.log(`Scroll collected! HP: ${this.character.currentHP}/${this.character.maxHP}, Mana: ${this.character.currentMana}/${this.character.maxMana}`);
    }

    cleanupProjectiles() {
        // Entferne Projektile die zum Löschen markiert sind
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);
    }

    addProjectile(projectile) {
        this.projectiles.push(projectile);
    }

    // Main game loop - called continuously
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Apply camera transformation
        this.ctx.translate(this.camera_x, 0);

        // Draw all game objects in correct order
        this.addObjectsToMap(this.level.backgroundObjects);

        // Character (verschiedene Animationen) - Attack und Hurt haben Priorität
        if (this.character.isDead) {
            this.character.drawDeathSprite(this.ctx);
        } else if (this.character.isHurt) {
            this.character.drawHurtSprite(this.ctx);
        } else if (this.character.isAttacking1) {
            this.character.drawAttack1Sprite(this.ctx);
        } else if (this.character.isAttacking2) {
            this.character.drawAttack2Sprite(this.ctx);
        } else if (this.character.isAboveGround()) {
            this.character.drawJumpSprite(this.ctx);
        } else if (this.character.isRunning) {
            this.character.drawRunSprite(this.ctx);
        } else if (this.character.isIdle) {
            this.character.drawIdleSprite(this.ctx);
        } else {
            this.character.drawWalkSprite(this.ctx);
        }
        // Draw collision frame for character
        this.character.drawFrame(this.ctx);

        // Draw projectiles
        this.projectiles.forEach(projectile => {
            projectile.drawProjectileSprite(this.ctx);
            projectile.drawFrame(this.ctx);
        });

        this.addObjectsToMap(this.level.clouds);

        // Draw collectibles (nicht eingesammelte)
        if (this.level.collectibles) {
            this.level.collectibles.forEach(collectible => {
                if (!collectible.collected) {
                    this.addToMap(collectible);
                    collectible.drawFrame(this.ctx);
                }
            });
        }

        this.addObjectsToMap(this.level.enemies);

        // Draw collision frames for all enemies
        this.drawCollisionFrames();

        // Reset camera transformation
        this.ctx.translate(-this.camera_x, 0);

        // Draw HUD (nach Camera Reset, damit es fest bleibt)
        this.drawHUD();

        // Continue game loop
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    drawHUD() {
        this.updateStatusBars();
        this.drawStatusBars();
        this.drawBossHealthBar();
        this.drawPauseButtonIfNotPaused();
        this.drawTouchControlsIfMobile();
    }

    updateStatusBars() {
        let healthPercentage = (this.character.currentHP / this.character.maxHP) * 100;
        let manaPercentage = (this.character.currentMana / this.character.maxMana) * 100;
        this.healthBar.setPercentage(healthPercentage);
        this.manaBar.setPercentage(manaPercentage);
    }

    drawStatusBars() {
        this.healthBar.draw(this.ctx);
        this.manaBar.draw(this.ctx);
    }

    drawPauseButtonIfNotPaused() {
        if (!this.isPaused) {
            this.drawPauseButton();
        }
    }

    drawTouchControlsIfMobile() {
        if (typeof isMobileDevice === 'function' && isMobileDevice() && !this.isPaused && touchControls) {
            touchControls.draw(this.ctx);
        }
    }

    drawPauseButton() {
        const dimensions = this.getPauseButtonDimensions();
        this.drawPauseButtonBackground(dimensions);
        this.drawPauseIcon(dimensions);
        this.storePauseButtonBounds(dimensions);
    }

    getPauseButtonDimensions() {
        const pauseIconSize = 40;
        const pauseIconX = this.canvas.width - pauseIconSize - 15;
        const pauseIconY = this.canvas.height - pauseIconSize - 15;
        return { pauseIconSize, pauseIconX, pauseIconY };
    }

    drawPauseButtonBackground(dimensions) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.fillRect(dimensions.pauseIconX, dimensions.pauseIconY, dimensions.pauseIconSize, dimensions.pauseIconSize);
    }

    drawPauseIcon(dimensions) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(dimensions.pauseIconX + 12, dimensions.pauseIconY + 8, 5, 24);
        this.ctx.fillRect(dimensions.pauseIconX + 23, dimensions.pauseIconY + 8, 5, 24);
    }

    storePauseButtonBounds(dimensions) {
        this.pauseButtonBounds = {
            x: dimensions.pauseIconX,
            y: dimensions.pauseIconY,
            width: dimensions.pauseIconSize,
            height: dimensions.pauseIconSize
        };
    }

    drawBossHealthBar() {
        let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (!endboss || endboss.isDead) return;
        if (this.isBossInView(endboss)) {
            this.renderBossHealthBar(endboss);
        }
    }

    isBossInView(endboss) {
        let endbossScreenX = endboss.x + this.camera_x;
        return endbossScreenX + endboss.width > -100 && endbossScreenX < this.canvas.width + 100;
    }

    renderBossHealthBar(endboss) {
        let bossHealthPercentage = (endboss.currentHP / endboss.maxHP) * 100;
        this.bossHealthBar.setPercentage(bossHealthPercentage);
        this.bossHealthBar.draw(this.ctx);
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo instanceof Endboss) {
            this.drawEndboss(mo);
        } else if (mo instanceof Goblin) {
            this.drawGoblin(mo);
        } else if (mo instanceof FlyingEye) {
            this.drawFlyingEye(mo);
        } else if (mo instanceof Mushroom) {
            this.drawMushroom(mo);
        } else if (mo instanceof Skeleton) {
            this.drawSkeleton(mo);
        } else {
            this.drawGenericObject(mo);
        }
    }

    drawEndboss(mo) {
        if (mo.isDead) {
            mo.drawDeathSprite(this.ctx);
        } else if (mo.isTakingHit) {
            mo.drawHitSprite(this.ctx);
        } else if (mo.isAttacking3) {
            mo.drawAttack3Sprite(this.ctx);
        } else if (mo.isAttacking2) {
            mo.drawAttack2Sprite(this.ctx);
        } else if (mo.isWalking) {
            mo.drawWalkSprite(this.ctx);
        } else {
            mo.drawIdleSprite(this.ctx);
        }
    }

    drawGoblin(mo) {
        if (mo.isDead) {
            mo.drawDeathSprite(this.ctx);
        } else if (mo.isTakingHit) {
            mo.drawTakeHitSprite(this.ctx);
        } else if (mo.isAttacking) {
            mo.drawAttackSprite(this.ctx);
        } else if (mo.isRunning) {
            mo.drawRunSprite(this.ctx);
        } else {
            mo.drawIdleSprite(this.ctx);
        }
    }

    drawFlyingEye(mo) {
        if (mo.isDead) {
            mo.drawDeathSprite(this.ctx);
        } else if (mo.isAttacking) {
            mo.drawAttackSprite(this.ctx);
        } else {
            mo.drawFlightSprite(this.ctx);
        }
    }

    drawMushroom(mo) {
        if (mo.isDead) {
            mo.drawDeathSprite(this.ctx);
        } else if (mo.isTakingHit) {
            mo.drawTakeHitSprite(this.ctx);
        } else if (mo.isAttacking) {
            mo.drawAttackSprite(this.ctx);
        } else if (mo.isRunning) {
            mo.drawRunSprite(this.ctx);
        } else {
            mo.drawIdleSprite(this.ctx);
        }
    }

    drawSkeleton(mo) {
        if (mo.isDead) {
            mo.drawDeathSprite(this.ctx);
        } else if (mo.isTakingHit) {
            mo.drawTakeHitSprite(this.ctx);
        } else if (mo.isAttacking) {
            mo.drawAttackSprite(this.ctx);
        } else if (mo.isWalking) {
            mo.drawWalkSprite(this.ctx);
        } else {
            mo.drawIdleSprite(this.ctx);
        }
    }

    drawGenericObject(mo) {
        if(mo.otherDirection) {
            this.ctx.save();
            this.ctx.translate(mo.x + mo.width, mo.y);
            this.ctx.scale(-1, 1);
            if (mo.img) {
                this.ctx.drawImage(mo.img, 0, 0, mo.width, mo.height);
            }
            this.ctx.restore();
        } else {
            if (mo.img) {
                this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
            }
        }
    }

    drawCollisionFrames() {
        // Draw collision frames for all enemies
        this.level.enemies.forEach(enemy => {
            if (enemy.drawFrame) {
                enemy.drawFrame(this.ctx);
            }
        });
    }

    // Cleanup method to clear all intervals
    cleanup() {
        this.clearIntervals();
        this.cleanupCharacter();
        this.cleanupEnemies();
        this.cleanupProjectiles();
    }

    clearIntervals() {
        if (this.scrollSpawnIntervalId) {
            clearInterval(this.scrollSpawnIntervalId);
            this.scrollSpawnIntervalId = null;
        }
        if (this.collisionCheckIntervalId) {
            clearInterval(this.collisionCheckIntervalId);
            this.collisionCheckIntervalId = null;
        }
    }

    cleanupCharacter() {
        if (this.character && this.character.cleanup) {
            this.character.cleanup();
        }
    }

    cleanupEnemies() {
        this.level.enemies.forEach(enemy => {
            if (enemy.cleanup) {
                enemy.cleanup();
            }
        });
    }

    cleanupProjectiles() {
        this.projectiles.forEach(projectile => {
            if (projectile.cleanup) {
                projectile.cleanup();
            }
        });
    }

    checkGameOver() {
        // Check if character is dead and death animation is finished
        if (this.character.isDead && this.character.deathAnimationFinished && !this.gameOverTriggered) {
            this.gameOverTriggered = true;
            // Add small delay to ensure death animation is fully visible
            setTimeout(() => {
                this.triggerGameOver();
            }, 500); // 500ms delay
        }
    }

    triggerGameOver() {
        console.log('Triggering Game Over...');
        
        // Show game over screen via menu (don't cleanup yet, keep game visible but darkened)
        if (typeof menu !== 'undefined' && menu) {
            menu.showGameOver();
        }
    }

    checkVictory() {
        // Check if endboss exists and is dead with finished death animation
        let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        
        if (endboss && endboss.isDead && endboss.deathAnimationFinished && !this.victoryTriggered) {
            this.victoryTriggered = true;
            // Add small delay to ensure death animation is fully visible
            setTimeout(() => {
                this.triggerVictory();
            }, 500); // 500ms delay
        }
    }

    triggerVictory() {
        console.log('Triggering Victory!');
        
        // Show victory screen via menu (don't cleanup yet, keep game visible but darkened)
        if (typeof menu !== 'undefined' && menu) {
            menu.showVictory();
        }
    }
}