class Skeleton extends MovableObject {
    // Position and Size
    y = 165;
    height = 350;
    width = 350;

    // Health System
    maxHP = 35;
    currentHP = 35;
    isDead = false;

    // Collision Box (angepasst an tatsächlichen Körper - zentriert)
    collisionOffsetX = 130;
    collisionOffsetY = 100;
    collisionWidth = 90;
    collisionHeight = 140;

    // Idle Animation Properties
    idleImage;
    currentIdleFrame = 0;
    idleSpriteWidth = 150;
    idleSpriteHeight = 150;
    idleFrameCount = 4;
    idleDisplayWidth = 350;
    idleDisplayHeight = 350;
    idleAnimationSpeed = 150;
    lastIdleFrameTime = Date.now();

    // Walk Animation Properties
    walkImage;
    currentWalkFrame = 0;
    walkSpriteWidth = 150;
    walkSpriteHeight = 150;
    walkFrameCount = 4;
    walkDisplayWidth = 350;
    walkDisplayHeight = 350;
    walkAnimationSpeed = 120;
    lastWalkFrameTime = Date.now();

    // Take Hit Animation Properties
    takeHitImage;
    currentTakeHitFrame = 0;
    takeHitSpriteWidth = 150;
    takeHitSpriteHeight = 150;
    takeHitFrameCount = 4;
    takeHitDisplayWidth = 350;
    takeHitDisplayHeight = 350;
    takeHitAnimationSpeed = 100;
    lastTakeHitFrameTime = Date.now();
    isTakingHit = false;

    // Attack Animation Properties
    attackImage;
    currentAttackFrame = 0;
    attackSpriteWidth = 150;
    attackSpriteHeight = 150;
    attackFrameCount = 8;
    attackDisplayWidth = 350;
    attackDisplayHeight = 350;
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
    deathDisplayWidth = 350;
    deathDisplayHeight = 350;
    deathAnimationSpeed = 150;
    lastDeathFrameTime = Date.now();
    deathAnimationFinished = false;

    // State
    isWalking = true;

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
        this.loadIdleImage('./assets/monsters/Skeleton/Idle.png');
        this.loadWalkImage('./assets/monsters/Skeleton/Walk.png');
        this.loadTakeHitImage('./assets/monsters/Skeleton/Take Hit.png');
        this.loadAttackImage('./assets/monsters/Skeleton/Attack.png');
        this.loadDeathImage('./assets/monsters/Skeleton/Death.png');

        // Random position and speed
        this.x = 200 + Math.random() * 500;
        this.speed = 0.5 + Math.random() * 0.5;

        // Y-Position Variation (±15px)
        this.y += Math.random() * 30 - 15;

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

    loadWalkImage(path) {
        this.walkImage = new Image();
        this.walkImage.src = path;
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

    updateWalkAnimation() {
        let now = Date.now();
        if (now - this.lastWalkFrameTime > this.walkAnimationSpeed) {
            this.currentWalkFrame++;
            if (this.currentWalkFrame >= this.walkFrameCount) {
                this.currentWalkFrame = 0;
            }
            this.lastWalkFrameTime = now;
        }
    }


    updateAttackAnimation() {
        if (!this.isAttacking) return;

        let now = Date.now();
        if (now - this.lastAttackFrameTime > this.attackAnimationSpeed) {
            this.advanceAttackFrame(now);
        }
    }







    drawIdleSprite(ctx) {
        let frameX = this.currentIdleFrame * this.idleSpriteWidth;
        this.drawSprite(ctx, this.idleImage, frameX,
            this.idleSpriteWidth, this.idleSpriteHeight,
            this.idleDisplayWidth, this.idleDisplayHeight);
    }

    drawWalkSprite(ctx) {
        let frameX = this.currentWalkFrame * this.walkSpriteWidth;
        this.drawSprite(ctx, this.walkImage, frameX,
            this.walkSpriteWidth, this.walkSpriteHeight,
            this.walkDisplayWidth, this.walkDisplayHeight);
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
            if (this.shouldSkipPatrol()) return;

            if (this.isAggro) {
                this.handleAggroMovement();
            } else {
                this.handlePatrolMovement();
            }
        }, 1000 / 60);
    }





    animate() {
        setInterval(() => {
            // Check if game is paused
            if (this.world && this.world.isPaused) return;
            
            this.updateIdleAnimation();
            this.updateWalkAnimation();
            this.updateTakeHitAnimation();
            this.updateAttackAnimation();
            this.updateDeathAnimation();
        }, 1000 / 60);
    }


    dealDamageToCharacter() {
        if (!this.world || !this.world.character) return;

        let distance = Math.abs(this.x - this.world.character.x);

        if (distance <= this.attackRange + 20) {
            this.world.character.takeAttackDamage(CONFIG.DAMAGE.SKELETON_ATTACK);
            console.log('Skeleton dealt damage to character!');
        }
    }


    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.currentDeathFrame = 0;
        this.deathAnimationFinished = false;
        this.speed = 0;
        console.log('Skeleton died!');
    }

    drawFrame(ctx) {
        if (!CONFIG.SHOW_COLLISION_BOXES) return;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.rect(
            this.x + this.collisionOffsetX,
            this.y + this.collisionOffsetY,
            this.collisionWidth,
            this.collisionHeight
        );
        ctx.stroke();
    }
}
