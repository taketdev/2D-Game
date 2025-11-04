/**
 * World Drawing System
 * Contains main draw loop, entity rendering, and HUD
 */

// Main game loop - called continuously
World.prototype.draw = function() {
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
};

World.prototype.addObjectsToMap = function(objects) {
    objects.forEach(o => {
        this.addToMap(o);
    });
};

World.prototype.addToMap = function(mo) {
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
};

World.prototype.drawEndboss = function(mo) {
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
};

World.prototype.drawGoblin = function(mo) {
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
};

World.prototype.drawFlyingEye = function(mo) {
    if (mo.isDead) {
        mo.drawDeathSprite(this.ctx);
    } else if (mo.isAttacking) {
        mo.drawAttackSprite(this.ctx);
    } else {
        mo.drawFlightSprite(this.ctx);
    }
};

World.prototype.drawMushroom = function(mo) {
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
};

World.prototype.drawSkeleton = function(mo) {
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
};

World.prototype.drawGenericObject = function(mo) {
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
};

World.prototype.drawCollisionFrames = function() {
    // Draw collision frames for all enemies
    this.level.enemies.forEach(enemy => {
        if (enemy.drawFrame) {
            enemy.drawFrame(this.ctx);
        }
    });
};

// HUD Drawing
World.prototype.drawHUD = function() {
    this.updateStatusBars();
    this.drawStatusBars();
    this.drawBossHealthBar();
    this.drawPauseButtonIfNotPaused();
    this.drawTouchControlsIfMobile();
};

World.prototype.updateStatusBars = function() {
    let healthPercentage = (this.character.currentHP / this.character.maxHP) * 100;
    let manaPercentage = (this.character.currentMana / this.character.maxMana) * 100;
    this.healthBar.setPercentage(healthPercentage);
    this.manaBar.setPercentage(manaPercentage);
};

World.prototype.drawStatusBars = function() {
    this.healthBar.draw(this.ctx);
    this.manaBar.draw(this.ctx);
};

World.prototype.drawPauseButtonIfNotPaused = function() {
    if (!this.isPaused) {
        this.drawPauseButton();
    }
};

World.prototype.drawTouchControlsIfMobile = function() {
    if (typeof isMobileDevice === 'function' && isMobileDevice() && !this.isPaused && touchControls) {
        touchControls.draw(this.ctx);
    }
};

World.prototype.drawPauseButton = function() {
    const dimensions = this.getPauseButtonDimensions();
    this.drawPauseButtonBackground(dimensions);
    this.drawPauseIcon(dimensions);
    this.storePauseButtonBounds(dimensions);
};

World.prototype.getPauseButtonDimensions = function() {
    const pauseIconSize = 40;
    const pauseIconX = this.canvas.width - pauseIconSize - 15;
    const pauseIconY = this.canvas.height - pauseIconSize - 15;
    return { pauseIconSize, pauseIconX, pauseIconY };
};

World.prototype.drawPauseButtonBackground = function(dimensions) {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.fillRect(dimensions.pauseIconX, dimensions.pauseIconY, dimensions.pauseIconSize, dimensions.pauseIconSize);
};

World.prototype.drawPauseIcon = function(dimensions) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(dimensions.pauseIconX + 12, dimensions.pauseIconY + 8, 5, 24);
    this.ctx.fillRect(dimensions.pauseIconX + 23, dimensions.pauseIconY + 8, 5, 24);
};

World.prototype.storePauseButtonBounds = function(dimensions) {
    this.pauseButtonBounds = {
        x: dimensions.pauseIconX,
        y: dimensions.pauseIconY,
        width: dimensions.pauseIconSize,
        height: dimensions.pauseIconSize
    };
};

World.prototype.drawBossHealthBar = function() {
    let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    if (!endboss || endboss.isDead) return;
    if (this.isBossInView(endboss)) {
        this.renderBossHealthBar(endboss);
    }
};

World.prototype.isBossInView = function(endboss) {
    let endbossScreenX = endboss.x + this.camera_x;
    return endbossScreenX + endboss.width > -100 && endbossScreenX < this.canvas.width + 100;
};

World.prototype.renderBossHealthBar = function(endboss) {
    let bossHealthPercentage = (endboss.currentHP / endboss.maxHP) * 100;
    this.bossHealthBar.setPercentage(bossHealthPercentage);
    this.bossHealthBar.draw(this.ctx);
};
