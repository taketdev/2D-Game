/**
 * World Drawing System
 * Contains main draw loop, entity rendering, and HUD
 */

/**
 * Main draw loop that renders all game objects and UI elements
 * @function draw
 * @returns {void}
 */
World.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.drawCharacter();
    this.drawProjectiles();
    this.addObjectsToMap(this.level.clouds);
    this.drawCollectibles();
    this.addObjectsToMap(this.level.enemies);
    this.drawCollisionFrames();
    this.ctx.translate(-this.camera_x, 0);
    this.drawHUD();
    let self = this;
    requestAnimationFrame(function() { self.draw(); });
};

/**
 * Draws the character with appropriate animation based on current state
 * @function drawCharacter
 * @returns {void}
 */
World.prototype.drawCharacter = function() {
    this.drawCharacterSprite();
    this.character.drawFrame(this.ctx);
};

/**
 * Draws the appropriate character sprite based on current state
 * @function drawCharacterSprite
 * @returns {void}
 */
World.prototype.drawCharacterSprite = function() {
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
};

/**
 * Draws all projectiles on the map
 * @function drawProjectiles
 * @returns {void}
 */
World.prototype.drawProjectiles = function() {
    this.projectiles.forEach(projectile => {
        projectile.drawProjectileSprite(this.ctx);
        projectile.drawFrame(this.ctx);
    });
};

/**
 * Draws all collectible items that have not been collected yet
 * @function drawCollectibles
 * @returns {void}
 */
World.prototype.drawCollectibles = function() {
    if (this.level.collectibles) {
        this.level.collectibles.forEach(collectible => {
            if (!collectible.collected) {
                this.addToMap(collectible);
                collectible.drawFrame(this.ctx);
            }
        });
    }
};

/**
 * Adds an array of objects to the map for rendering
 * @function addObjectsToMap
 * @param {Array} objects - Array of objects to be added to the map
 * @returns {void}
 */
World.prototype.addObjectsToMap = function(objects) {
    objects.forEach(o => {
        this.addToMap(o);
    });
};

/**
 * Adds a single object to the map and determines the appropriate drawing method
 * @function addToMap
 * @param {Object} mo - Movable object to be added to the map
 * @returns {void}
 */
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

/**
 * Draws the endboss with appropriate animation based on current state
 * @function drawEndboss
 * @param {Object} mo - Endboss object to be drawn
 * @returns {void}
 */
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

/**
 * Draws the goblin with appropriate animation based on current state
 * @function drawGoblin
 * @param {Object} mo - Goblin object to be drawn
 * @returns {void}
 */
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

/**
 * Draws the flying eye with appropriate animation based on current state
 * @function drawFlyingEye
 * @param {Object} mo - Flying eye object to be drawn
 * @returns {void}
 */
World.prototype.drawFlyingEye = function(mo) {
    if (mo.isDead) {
        mo.drawDeathSprite(this.ctx);
    } else if (mo.isAttacking) {
        mo.drawAttackSprite(this.ctx);
    } else {
        mo.drawFlightSprite(this.ctx);
    }
};

/**
 * Draws the mushroom with appropriate animation based on current state
 * @function drawMushroom
 * @param {Object} mo - Mushroom object to be drawn
 * @returns {void}
 */
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

/**
 * Draws the skeleton with appropriate animation based on current state
 * @function drawSkeleton
 * @param {Object} mo - Skeleton object to be drawn
 * @returns {void}
 */
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

/**
 * Draws generic objects with optional direction flipping
 * @function drawGenericObject
 * @param {Object} mo - Movable object to be drawn
 * @returns {void}
 */
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

/**
 * Draws collision frames for all enemies for debugging purposes
 * @function drawCollisionFrames
 * @returns {void}
 */
World.prototype.drawCollisionFrames = function() {
    this.level.enemies.forEach(enemy => {
        if (enemy.drawFrame) {
            enemy.drawFrame(this.ctx);
        }
    });
};

/**
 * Draws the heads-up display including status bars and UI elements
 * @function drawHUD
 * @returns {void}
 */
World.prototype.drawHUD = function() {
    this.updateStatusBars();
    this.drawStatusBars();
    this.drawBossHealthBar();
    this.drawPauseButtonIfNotPaused();
    this.drawTouchControlsIfMobile();
};

/**
 * Updates the health and mana status bars with current values
 * @function updateStatusBars
 * @returns {void}
 */
World.prototype.updateStatusBars = function() {
    let healthPercentage = (this.character.currentHP / this.character.maxHP) * 100;
    let manaPercentage = (this.character.currentMana / this.character.maxMana) * 100;
    this.healthBar.setPercentage(healthPercentage);
    this.manaBar.setPercentage(manaPercentage);
};

/**
 * Renders the health and mana status bars on screen
 * @function drawStatusBars
 * @returns {void}
 */
World.prototype.drawStatusBars = function() {
    this.healthBar.draw(this.ctx);
    this.manaBar.draw(this.ctx);
};

/**
 * Draws the pause button if the game is not currently paused
 * @function drawPauseButtonIfNotPaused
 * @returns {void}
 */
World.prototype.drawPauseButtonIfNotPaused = function() {
    if (!this.isPaused) {
        this.drawPauseButton();
    }
};

/**
 * Draws touch controls if on mobile device and game is not paused
 * @function drawTouchControlsIfMobile
 * @returns {void}
 */
World.prototype.drawTouchControlsIfMobile = function() {
    if (typeof isMobileDevice === 'function' && isMobileDevice() && !this.isPaused && touchControls) {
        touchControls.draw(this.ctx);
    }
};

/**
 * Draws the pause button with background and icon
 * @function drawPauseButton
 * @returns {void}
 */
World.prototype.drawPauseButton = function() {
    const dimensions = this.getPauseButtonDimensions();
    this.drawPauseButtonBackground(dimensions);
    this.drawPauseIcon(dimensions);
    this.storePauseButtonBounds(dimensions);
};

/**
 * Calculates and returns the dimensions for the pause button
 * @function getPauseButtonDimensions
 * @returns {Object} Object containing pause button dimensions
 */
World.prototype.getPauseButtonDimensions = function() {
    const pauseIconSize = 40;
    const pauseIconX = this.canvas.width - pauseIconSize - 15;
    const pauseIconY = this.canvas.height - pauseIconSize - 15;
    return { pauseIconSize, pauseIconX, pauseIconY };
};

/**
 * Draws the background for the pause button
 * @function drawPauseButtonBackground
 * @param {Object} dimensions - Dimensions object for the pause button
 * @returns {void}
 */
World.prototype.drawPauseButtonBackground = function(dimensions) {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.fillRect(dimensions.pauseIconX, dimensions.pauseIconY, dimensions.pauseIconSize, dimensions.pauseIconSize);
};

/**
 * Draws the pause icon consisting of two vertical bars
 * @function drawPauseIcon
 * @param {Object} dimensions - Dimensions object for the pause button
 * @returns {void}
 */
World.prototype.drawPauseIcon = function(dimensions) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(dimensions.pauseIconX + 12, dimensions.pauseIconY + 8, 5, 24);
    this.ctx.fillRect(dimensions.pauseIconX + 23, dimensions.pauseIconY + 8, 5, 24);
};

/**
 * Stores the pause button bounds for click detection
 * @function storePauseButtonBounds
 * @param {Object} dimensions - Dimensions object for the pause button
 * @returns {void}
 */
World.prototype.storePauseButtonBounds = function(dimensions) {
    this.pauseButtonBounds = {
        x: dimensions.pauseIconX,
        y: dimensions.pauseIconY,
        width: dimensions.pauseIconSize,
        height: dimensions.pauseIconSize
    };
};

/**
 * Draws the boss health bar if boss is present and visible
 * @function drawBossHealthBar
 * @returns {void}
 */
World.prototype.drawBossHealthBar = function() {
    let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    if (!endboss || endboss.isDead) return;
    if (this.isBossInView(endboss)) {
        this.renderBossHealthBar(endboss);
    }
};

/**
 * Checks if the boss is currently visible on screen
 * @function isBossInView
 * @param {Object} endboss - The endboss object to check
 * @returns {boolean} True if boss is visible on screen
 */
World.prototype.isBossInView = function(endboss) {
    let endbossScreenX = endboss.x + this.camera_x;
    return endbossScreenX + endboss.width > -100 && endbossScreenX < this.canvas.width + 100;
};

/**
 * Renders the boss health bar with current health percentage
 * @function renderBossHealthBar
 * @param {Object} endboss - The endboss object to render health bar for
 * @returns {void}
 */
World.prototype.renderBossHealthBar = function(endboss) {
    let bossHealthPercentage = (endboss.currentHP / endboss.maxHP) * 100;
    this.bossHealthBar.setPercentage(bossHealthPercentage);
    this.bossHealthBar.draw(this.ctx);
};
