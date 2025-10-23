class Goblin extends MovableObject {
    // Position and Size
    y = 190;
    height = 250;
    width = 250;

    // Health System
    maxHP = 30;
    currentHP = 30;
    isDead = false;

    // Collision Box (angepasst an tatsächlichen Körper - zentriert)
    collisionOffsetX = 90;
    collisionOffsetY = 80;
    collisionWidth = 65;
    collisionHeight = 100;

    // Idle Animation Properties
    idleImage;
    currentIdleFrame = 0;
    idleSpriteWidth = 150;
    idleSpriteHeight = 150;
    idleFrameCount = 4;
    idleDisplayWidth = 250;
    idleDisplayHeight = 250;
    idleAnimationSpeed = 150;
    lastIdleFrameTime = Date.now();

    // Run Animation Properties
    runImage;
    currentRunFrame = 0;
    runSpriteWidth = 150;
    runSpriteHeight = 150;
    runFrameCount = 8;
    runDisplayWidth = 250;
    runDisplayHeight = 250;
    runAnimationSpeed = 120; // Verlangsamt von 80 auf 120ms
    lastRunFrameTime = Date.now();

    // Take Hit Animation Properties
    takeHitImage;
    currentTakeHitFrame = 0;
    takeHitSpriteWidth = 150;
    takeHitSpriteHeight = 150;
    takeHitFrameCount = 4;
    takeHitDisplayWidth = 250;
    takeHitDisplayHeight = 250;
    takeHitAnimationSpeed = 100;
    lastTakeHitFrameTime = Date.now();
    isTakingHit = false;

    // Attack Animation Properties
    attackImage;
    currentAttackFrame = 0;
    attackSpriteWidth = 150;
    attackSpriteHeight = 150;
    attackFrameCount = 8;
    attackDisplayWidth = 250;
    attackDisplayHeight = 250;
    attackAnimationSpeed = 80;
    lastAttackFrameTime = Date.now();
    isAttacking = false;
    attackHitFrame = 4; // Frame bei dem der Treffer registriert wird

    // Death Animation Properties
    deathImage;
    currentDeathFrame = 0;
    deathSpriteWidth = 150;
    deathSpriteHeight = 150;
    deathFrameCount = 4;
    deathDisplayWidth = 250;
    deathDisplayHeight = 250;
    deathAnimationSpeed = 150;
    lastDeathFrameTime = Date.now();
    deathAnimationFinished = false;

    // State
    isRunning = true;

    // Patrol System
    patrolStartX;
    patrolEndX;
    patrolRange = 300; // 300px Patrol-Bereich
    movingRight = false;

    // AI Behavior
    turnTowardsCharacter = false; // Direction wird in patrol() gesetzt
    aggroRange = 300; // 300px Reichweite für Aggro
    isAggro = false;
    targetCharacterX = 0;
    attackRange = 80; // 80px Reichweite für Attack
    attackCooldown = 2000; // 2 Sekunden Cooldown zwischen Attacks
    lastAttackTime = 0;

    // Interval IDs für Cleanup
    patrolIntervalId;
    animationIntervalId;

    constructor() {
        super();
        this.loadIdleImage('./assets/monsters/Goblin/Idle.png');
        this.loadRunImage('./assets/monsters/Goblin/Run.png');
        this.loadTakeHitImage('./assets/monsters/Goblin/Take Hit.png');
        this.loadAttackImage('./assets/monsters/Goblin/Attack.png');
        this.loadDeathImage('./assets/monsters/Goblin/Death.png');

        // Random position and speed (langsamer, angepasst an Character)
        this.x = 200 + Math.random() * 500;
        this.speed = 0.5 + Math.random() * 0.5;

        // Setup Patrol-Bereich
        this.patrolStartX = this.x;
        this.patrolEndX = this.x + this.patrolRange;
        this.movingRight = Math.random() > 0.5; // Random start direction
        this.otherDirection = !this.movingRight; // Sprite spiegeln

        this.animate();
        this.patrol();
    }

    loadIdleImage(path) {
        this.idleImage = new Image();
        this.idleImage.src = path;
    }

    loadRunImage(path) {
        this.runImage = new Image();
        this.runImage.src = path;
    }

    loadTakeHitImage(path) {
        this.takeHitImage = new Image();
        this.takeHitImage.src = path;
    }

    loadAttackImage(path) {
        this.attackImage = new Image();
        this.attackImage.src = path;
    }

    loadDeathImage(path) {
        this.deathImage = new Image();
        this.deathImage.src = path;
    }

    updateIdleAnimation() {
        let now = Date.now();
        if (now - this.lastIdleFrameTime > this.idleAnimationSpeed) {
            this.currentIdleFrame++;
            if (this.currentIdleFrame >= this.idleFrameCount) {
                this.currentIdleFrame = 0;
            }
            this.lastIdleFrameTime = now;
        }
    }

    updateRunAnimation() {
        let now = Date.now();
        if (now - this.lastRunFrameTime > this.runAnimationSpeed) {
            this.currentRunFrame++;
            if (this.currentRunFrame >= this.runFrameCount) {
                this.currentRunFrame = 0;
            }
            this.lastRunFrameTime = now;
        }
    }

    updateTakeHitAnimation() {
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
    }

    updateAttackAnimation() {
        if (!this.isAttacking) return;

        let now = Date.now();
        if (now - this.lastAttackFrameTime > this.attackAnimationSpeed) {
            this.currentAttackFrame++;

            // Bei attackHitFrame Schaden zufügen
            if (this.currentAttackFrame === this.attackHitFrame && this.world) {
                this.dealDamageToCharacter();
            }

            if (this.currentAttackFrame >= this.attackFrameCount) {
                this.isAttacking = false;
                this.currentAttackFrame = 0;
            }
            this.lastAttackFrameTime = now;
        }
    }

    updateDeathAnimation() {
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
    }

    drawSprite(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight) {
        if (!image || !image.complete) return;

        // Disable image smoothing for crisp pixel art
        ctx.imageSmoothingEnabled = false;

        if (this.otherDirection) {
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
        } else {
            ctx.drawImage(
                image,
                frameX, 0,
                frameWidth, frameHeight,
                this.x, this.y,
                displayWidth, displayHeight
            );
        }

        // Re-enable image smoothing for other objects
        ctx.imageSmoothingEnabled = true;
    }

    drawIdleSprite(ctx) {
        let frameX = this.currentIdleFrame * this.idleSpriteWidth;
        this.drawSprite(ctx, this.idleImage, frameX,
            this.idleSpriteWidth, this.idleSpriteHeight,
            this.idleDisplayWidth, this.idleDisplayHeight);
    }

    drawRunSprite(ctx) {
        let frameX = this.currentRunFrame * this.runSpriteWidth;
        this.drawSprite(ctx, this.runImage, frameX,
            this.runSpriteWidth, this.runSpriteHeight,
            this.runDisplayWidth, this.runDisplayHeight);
    }

    drawTakeHitSprite(ctx) {
        let frameX = this.currentTakeHitFrame * this.takeHitSpriteWidth;
        this.drawSprite(ctx, this.takeHitImage, frameX,
            this.takeHitSpriteWidth, this.takeHitSpriteHeight,
            this.takeHitDisplayWidth, this.takeHitDisplayHeight);
    }

    drawAttackSprite(ctx) {
        let frameX = this.currentAttackFrame * this.attackSpriteWidth;
        this.drawSprite(ctx, this.attackImage, frameX,
            this.attackSpriteWidth, this.attackSpriteHeight,
            this.attackDisplayWidth, this.attackDisplayHeight);
    }

    drawDeathSprite(ctx) {
        let frameX = this.currentDeathFrame * this.deathSpriteWidth;
        this.drawSprite(ctx, this.deathImage, frameX,
            this.deathSpriteWidth, this.deathSpriteHeight,
            this.deathDisplayWidth, this.deathDisplayHeight);
    }

    patrol() {
        this.patrolIntervalId = setInterval(() => {
            if (this.isDead) return;

            // Blockiere Bewegung während Attack
            if (this.isAttacking) return;

            // Wenn Aggro: Bewege sanft zum Character
            if (this.isAggro) {
                let distanceToTarget = this.targetCharacterX - this.x;
                let absDistance = Math.abs(distanceToTarget);

                // Dead Zone: Wenn Character sehr nah ist (±30px), nicht mehr bewegen/drehen
                if (absDistance < 30) {
                    return;
                }

                if (distanceToTarget < 0) {
                    // Character ist links
                    this.x -= this.speed * 0.7; // 30% langsamer für sanfte Verfolgung
                    this.otherDirection = true;
                } else {
                    // Character ist rechts
                    this.x += this.speed * 0.7;
                    this.otherDirection = false;
                }
            } else {
                // Normale Patrol-Bewegung
                if (this.movingRight) {
                    this.x += this.speed;
                    this.otherDirection = false;
                } else {
                    this.x -= this.speed;
                    this.otherDirection = true;
                }

                // Prüfe Patrol-Grenzen und drehe um
                if (this.x >= this.patrolEndX) {
                    this.movingRight = false;
                } else if (this.x <= this.patrolStartX) {
                    this.movingRight = true;
                }
            }
        }, 1000 / 60);
    }

    setAggro(character) {
        // Kein Aggro wenn Character tot
        if (character.isDead) {
            this.isAggro = false;
            return;
        }

        let distance = Math.abs(this.x - character.x);
        this.isAggro = distance <= this.aggroRange;
        this.targetCharacterX = character.x;
    }

    animate() {
        // Animation updates (60 FPS for smoother animations)
        this.animationIntervalId = setInterval(() => {
            this.updateIdleAnimation();
            this.updateRunAnimation();
            this.updateTakeHitAnimation();
            this.updateAttackAnimation();
            this.updateDeathAnimation();
        }, 1000 / 60);
    }

    // Attack Character wenn in Reichweite
    tryAttack(character) {
        if (this.isDead || this.isAttacking) return;

        let distance = Math.abs(this.x - character.x);
        let now = Date.now();

        // Prüfe ob in Attack-Range und Cooldown abgelaufen
        if (distance <= this.attackRange && now - this.lastAttackTime >= this.attackCooldown) {
            this.isAttacking = true;
            this.currentAttackFrame = 0;
            this.lastAttackTime = now;
        }
    }

    // Schaden an Character zufügen bei Attack-Frame
    dealDamageToCharacter() {
        if (!this.world || !this.world.character) return;

        let distance = Math.abs(this.x - this.world.character.x);

        // Prüfe ob Character noch in Reichweite ist
        if (distance <= this.attackRange + 20) { // +20px Toleranz
            this.world.character.takeAttackDamage(CONFIG.DAMAGE.GOBLIN_ATTACK);
            console.log('Goblin dealt damage to character!');
        }
    }

    playTakeHitAnimation() {
        if (this.isDead || this.isTakingHit) return;
        this.isTakingHit = true;
        this.currentTakeHitFrame = 0;
    }

    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.currentDeathFrame = 0;
        this.deathAnimationFinished = false;
        this.speed = 0; // Stop movement
        console.log('Goblin died!');
        this.cleanup();
    }

    // Cleanup method to clear all intervals
    cleanup() {
        if (this.patrolIntervalId) {
            clearInterval(this.patrolIntervalId);
            this.patrolIntervalId = null;
        }
        if (this.animationIntervalId) {
            clearInterval(this.animationIntervalId);
            this.animationIntervalId = null;
        }
    }

    // Debug: Draw collision frame
    drawFrame(ctx) {
        if (!CONFIG.SHOW_COLLISION_BOXES) return;

        // Collision box (blau)
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'blue';
        ctx.rect(
            this.x + this.collisionOffsetX,
            this.y + this.collisionOffsetY,
            this.collisionWidth,
            this.collisionHeight
        );
        ctx.stroke();
    }
}
