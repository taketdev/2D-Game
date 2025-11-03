class Mushroom extends MovableObject {
    // Position and Size
    y = 148;
    height = 300;
    width = 300;

    // Health System
    maxHP = 25;
    currentHP = 25;
    isDead = false;

    // Collision Box (angepasst an tatsächlichen Körper - zentriert)
    collisionOffsetX = 110;
    collisionOffsetY = 120;
    collisionWidth = 75;
    collisionHeight = 85;

    // Idle Animation Properties
    idleImage;
    currentIdleFrame = 0;
    idleSpriteWidth = 150;
    idleSpriteHeight = 150;
    idleFrameCount = 4;
    idleDisplayWidth = 300;
    idleDisplayHeight = 300;
    idleAnimationSpeed = 150;
    lastIdleFrameTime = Date.now();

    // Run Animation Properties
    runImage;
    currentRunFrame = 0;
    runSpriteWidth = 150;
    runSpriteHeight = 150;
    runFrameCount = 8;
    runDisplayWidth = 300;
    runDisplayHeight = 300;
    runAnimationSpeed = 120;
    lastRunFrameTime = Date.now();

    // Take Hit Animation Properties
    takeHitImage;
    currentTakeHitFrame = 0;
    takeHitSpriteWidth = 150;
    takeHitSpriteHeight = 150;
    takeHitFrameCount = 4;
    takeHitDisplayWidth = 300;
    takeHitDisplayHeight = 300;
    takeHitAnimationSpeed = 100;
    lastTakeHitFrameTime = Date.now();
    isTakingHit = false;

    // Attack Animation Properties
    attackImage;
    currentAttackFrame = 0;
    attackSpriteWidth = 150;
    attackSpriteHeight = 150;
    attackFrameCount = 8;
    attackDisplayWidth = 300;
    attackDisplayHeight = 300;
    attackAnimationSpeed = 80;
    lastAttackFrameTime = Date.now();
    isAttacking = false;
    attackHitFrame = 4;

    // Death Animation Properties
    deathImage;
    currentDeathFrame = 0;
    deathSpriteWidth = 150;
    deathSpriteHeight = 150;
    deathFrameCount = 4;
    deathDisplayWidth = 300;
    deathDisplayHeight = 300;
    deathAnimationSpeed = 150;
    lastDeathFrameTime = Date.now();
    deathAnimationFinished = false;

    // State
    isRunning = true;

    // Patrol System
    patrolStartX;
    patrolEndX;
    patrolRange = 300;
    movingRight = false;

    // AI Behavior
    turnTowardsCharacter = false;
    aggroRange = 300;
    isAggro = false;
    targetCharacterX = 0;
    attackRange = 80;
    attackCooldown = 2000;
    lastAttackTime = 0;

    constructor() {
        super();
        this.loadIdleImage('./assets/monsters/Mushroom/Idle.png');
        this.loadRunImage('./assets/monsters/Mushroom/Run.png');
        this.loadTakeHitImage('./assets/monsters/Mushroom/Take Hit.png');
        this.loadAttackImage('./assets/monsters/Mushroom/Attack.png');
        this.loadDeathImage('./assets/monsters/Mushroom/Death.png');

        // Random position and speed
        this.x = 200 + Math.random() * 500;
        this.speed = 0.5 + Math.random() * 0.5;

        // Y-Position Variation (±10px)
        this.y += Math.random() * 20 - 10;

        // Setup Patrol-Bereich
        this.patrolStartX = this.x;
        this.patrolEndX = this.x + this.patrolRange;
        this.movingRight = Math.random() > 0.5;
        this.otherDirection = !this.movingRight;

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
        setInterval(() => {
            // Check if game is paused
            if (this.world && this.world.isPaused) return;
            
            if (this.isDead) return;

            if (this.isAttacking) return;

            if (this.isAggro) {
                let distanceToTarget = this.targetCharacterX - this.x;
                let absDistance = Math.abs(distanceToTarget);

                if (absDistance < 30) {
                    return;
                }

                if (distanceToTarget < 0) {
                    this.x -= this.speed * 0.7;
                    this.otherDirection = true;
                } else {
                    this.x += this.speed * 0.7;
                    this.otherDirection = false;
                }
            } else {
                if (this.movingRight) {
                    this.x += this.speed;
                    this.otherDirection = false;
                } else {
                    this.x -= this.speed;
                    this.otherDirection = true;
                }

                if (this.x >= this.patrolEndX) {
                    this.movingRight = false;
                } else if (this.x <= this.patrolStartX) {
                    this.movingRight = true;
                }
            }
        }, 1000 / 60);
    }

    setAggro(character) {
        if (character.isDead) {
            this.isAggro = false;
            return;
        }

        let distance = Math.abs(this.x - character.x);
        this.isAggro = distance <= this.aggroRange;
        this.targetCharacterX = character.x;
    }

    animate() {
        setInterval(() => {
            // Check if game is paused
            if (this.world && this.world.isPaused) return;
            
            this.updateIdleAnimation();
            this.updateRunAnimation();
            this.updateTakeHitAnimation();
            this.updateAttackAnimation();
            this.updateDeathAnimation();
        }, 1000 / 60);
    }

    tryAttack(character) {
        if (this.isDead || this.isAttacking) return;

        let distance = Math.abs(this.x - character.x);
        let now = Date.now();

        if (distance <= this.attackRange && now - this.lastAttackTime >= this.attackCooldown) {
            this.isAttacking = true;
            this.currentAttackFrame = 0;
            this.lastAttackTime = now;
        }
    }

    dealDamageToCharacter() {
        if (!this.world || !this.world.character) return;

        let distance = Math.abs(this.x - this.world.character.x);

        if (distance <= this.attackRange + 20) {
            this.world.character.takeAttackDamage(CONFIG.DAMAGE.MUSHROOM_ATTACK);
            console.log('Mushroom dealt damage to character!');
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
        this.speed = 0;
        console.log('Mushroom died!');
    }

    drawFrame(ctx) {
        if (!CONFIG.SHOW_COLLISION_BOXES) return;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'green';
        ctx.rect(
            this.x + this.collisionOffsetX,
            this.y + this.collisionOffsetY,
            this.collisionWidth,
            this.collisionHeight
        );
        ctx.stroke();
    }
}
