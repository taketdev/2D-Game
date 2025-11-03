class Endboss extends MovableObject {
    // Position and Size
    y = 160;
    height = 400;
    width = 350;

    // Health System
    maxHP = 500;
    currentHP = 500;
    isDead = false;

    // Collision Box (angepasst an tatsächlichen Körper - zentriert)
    collisionOffsetX = 100;
    collisionOffsetY = 70;
    collisionWidth = 150;
    collisionHeight = 210;

    // Idle Animation Properties
    idleImage;
    currentIdleFrame = 0;
    idleSpriteWidth = 176;
    idleSpriteHeight = 144;
    idleFrameCount = 13;
    idleDisplayWidth = 350;
    idleDisplayHeight = 350;
    idleAnimationSpeed = 80;
    lastIdleFrameTime = Date.now();

    // Walk Animation Properties
    walkImage;
    currentWalkFrame = 0;
    walkSpriteWidth = 176;
    walkSpriteHeight = 144;
    walkFrameCount = 10;
    walkDisplayWidth = 350;
    walkDisplayHeight = 350;
    walkAnimationSpeed = 60;
    lastWalkFrameTime = Date.now();

    // Hit Animation Properties
    hitImage;
    currentHitFrame = 0;
    hitSpriteWidth = 176;
    hitSpriteHeight = 144;
    hitFrameCount = 5;
    hitDisplayWidth = 350;
    hitDisplayHeight = 350;
    hitAnimationSpeed = 100;
    lastHitFrameTime = Date.now();
    isTakingHit = false;

    // Attack 2 Animation Properties
    attack2Image;
    currentAttack2Frame = 0;
    attack2SpriteWidth = 176;
    attack2SpriteHeight = 144;
    attack2FrameCount = 12;
    attack2DisplayWidth = 350;
    attack2DisplayHeight = 350;
    attack2AnimationSpeed = 80;
    lastAttack2FrameTime = Date.now();
    isAttacking2 = false;

    // Attack 3 Animation Properties
    attack3Image;
    currentAttack3Frame = 0;
    attack3SpriteWidth = 176;
    attack3SpriteHeight = 144;
    attack3FrameCount = 12;
    attack3DisplayWidth = 350;
    attack3DisplayHeight = 350;
    attack3AnimationSpeed = 80;
    lastAttack3FrameTime = Date.now();
    isAttacking3 = false;

    // Death Animation Properties
    deathImage;
    currentDeathFrame = 0;
    deathSpriteWidth = 176;
    deathSpriteHeight = 144;
    deathFrameCount = 13;
    deathDisplayWidth = 350;
    deathDisplayHeight = 350;
    deathAnimationSpeed = 150;
    lastDeathFrameTime = Date.now();
    deathAnimationFinished = false;

    // State
    isWalking = false;

    // AI Behavior
    turnTowardsCharacter = false; // Direction wird in updateMovement() gesetzt
    aggroRange = 450; // 400px Reichweite (erweitert für bessere Sichtbarkeit)
    isAggro = false;
    baseSpeed = 0.8; // Basis-Geschwindigkeit (erhöht für bessere Verfolgung)
    phase2SpeedMultiplier = 1.5; // 50% schneller in Phase 2
    targetCharacterX = 0; // Gespeicherte Character X-Position

    // Attack System
    attackRange = 120; // 120px Reichweite für Attacks
    attack2Cooldown = 3000; // 3 Sekunden Cooldown für Attack2
    attack3Cooldown = 4000; // 4 Sekunden Cooldown für Attack3
    lastAttack2Time = 0;
    lastAttack3Time = 0;
    attack2HitFrame = 6; // Frame bei dem Attack2 Schaden macht
    attack3HitFrame = 6; // Frame bei dem Attack3 Schaden macht

    constructor(){
        super();
        this.loadIdleImage('./assets/werwolf boss/Idle.png');
        this.loadWalkImage('./assets/werwolf boss/Walk.png');
        this.loadHitImage('./assets/werwolf boss/Hit.png');
        this.loadAttack2Image('./assets/werwolf boss/Attack2.png');
        this.loadAttack3Image('./assets/werwolf boss/Attack3.png');
        this.loadDeathImage('./assets/werwolf boss/Death.png');
        this.x = 4700; // Endboss am Ende von Battleground2 platziert (Battleground2 endet bei ~5040)
        this.speed = this.baseSpeed;
        this.animate();
        this.updateAI();
    }

    updateAI() {
        setInterval(() => {
            // Check if game is paused
            if (this.world && this.world.isPaused) return;
            
            if (this.isDead) return;

            // Update Phase basierend auf HP
            this.updatePhase();

            // Update Aggro basierend auf Character-Distanz (wird von world.class.js gesetzt)
            this.updateMovement();
        }, 1000 / 60);
    }

    updatePhase() {
        let hpPercentage = (this.currentHP / this.maxHP) * 100;

        if (hpPercentage <= 50) {
            // Phase 2: 50%-0% HP - Schnellere Bewegung
            this.speed = this.baseSpeed * this.phase2SpeedMultiplier;
        } else {
            // Phase 1: 100%-50% HP - Langsame Bewegung
            this.speed = this.baseSpeed;
        }
    }

    updateMovement() {
        if (this.shouldStopMovement()) return;

        if (this.isAggro && this.isWalking) {
            this.moveTowardsTarget();
        }
    }

    shouldStopMovement() {
        if (this.isAttacking2 || this.isAttacking3) {
            this.isWalking = false;
            return true;
        }

        if (this.world && this.world.character && this.world.character.isDead) {
            this.isWalking = false;
            return true;
        }

        return false;
    }

    moveTowardsTarget() {
        let distanceToTarget = this.targetCharacterX - this.x;
        let absDistance = Math.abs(distanceToTarget);

        if (absDistance < 50) {
            this.isWalking = false;
            return;
        }

        if (distanceToTarget < 0) {
            this.x -= this.speed;
            this.otherDirection = false;
        } else {
            this.x += this.speed;
            this.otherDirection = true;
        }
    }

    setAggro(character) {
        if (character.isDead) {
            this.deactivateAggro();
            return;
        }

        this.updateAggroState(character);
        this.updateWalkingState(character);
        this.targetCharacterX = character.x;
    }

    deactivateAggro() {
        this.isAggro = false;
        this.isWalking = false;
    }

    updateAggroState(character) {
        let distance = Math.abs(this.x - character.x);
        this.isAggro = distance <= this.aggroRange;
    }

    updateWalkingState(character) {
        if (Math.abs(character.x - this.x) >= 50) {
            this.isWalking = this.isAggro;
        } else {
            this.isWalking = false;
        }
    }

    loadIdleImage(path) {
        this.idleImage = new Image();
        this.idleImage.src = path;
    }

    loadWalkImage(path) {
        this.walkImage = new Image();
        this.walkImage.src = path;
    }

    loadHitImage(path) {
        this.hitImage = new Image();
        this.hitImage.src = path;
    }

    loadAttack2Image(path) {
        this.attack2Image = new Image();
        this.attack2Image.src = path;
    }

    loadAttack3Image(path) {
        this.attack3Image = new Image();
        this.attack3Image.src = path;
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

    updateHitAnimation() {
        if (!this.isTakingHit) return;

        let now = Date.now();
        if (now - this.lastHitFrameTime > this.hitAnimationSpeed) {
            this.currentHitFrame++;
            if (this.currentHitFrame >= this.hitFrameCount) {
                this.isTakingHit = false;
                this.currentHitFrame = 0;
            }
            this.lastHitFrameTime = now;
        }
    }

    updateAttack2Animation() {
        if (!this.isAttacking2) return;

        let now = Date.now();
        if (now - this.lastAttack2FrameTime > this.attack2AnimationSpeed) {
            this.advanceAttack2Frame(now);
        }
    }

    advanceAttack2Frame(now) {
        this.currentAttack2Frame++;

        if (this.currentAttack2Frame === this.attack2HitFrame && this.world) {
            this.dealDamageToCharacter(CONFIG.DAMAGE.ENDBOSS_ATTACK2);
        }

        if (this.currentAttack2Frame >= this.attack2FrameCount) {
            this.endAttack2Animation();
        }
        this.lastAttack2FrameTime = now;
    }

    endAttack2Animation() {
        this.isAttacking2 = false;
        this.currentAttack2Frame = 0;
    }

    updateAttack3Animation() {
        if (!this.isAttacking3) return;

        let now = Date.now();
        if (now - this.lastAttack3FrameTime > this.attack3AnimationSpeed) {
            this.advanceAttack3Frame(now);
        }
    }

    advanceAttack3Frame(now) {
        this.currentAttack3Frame++;

        if (this.currentAttack3Frame === this.attack3HitFrame && this.world) {
            this.dealDamageToCharacter(CONFIG.DAMAGE.ENDBOSS_ATTACK3);
        }

        if (this.currentAttack3Frame >= this.attack3FrameCount) {
            this.endAttack3Animation();
        }
        this.lastAttack3FrameTime = now;
    }

    endAttack3Animation() {
        this.isAttacking3 = false;
        this.currentAttack3Frame = 0;
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
            this.drawFlippedSprite(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight);
        } else {
            this.drawNormalSprite(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight);
        }

        ctx.imageSmoothingEnabled = true;
    }

    drawFlippedSprite(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight) {
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
    }

    drawNormalSprite(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight) {
        ctx.drawImage(
            image,
            frameX, 0,
            frameWidth, frameHeight,
            this.x, this.y,
            displayWidth, displayHeight
        );
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

    drawHitSprite(ctx) {
        let frameX = this.currentHitFrame * this.hitSpriteWidth;
        this.drawSprite(ctx, this.hitImage, frameX,
            this.hitSpriteWidth, this.hitSpriteHeight,
            this.hitDisplayWidth, this.hitDisplayHeight);
    }

    drawAttack2Sprite(ctx) {
        let frameX = this.currentAttack2Frame * this.attack2SpriteWidth;
        this.drawSprite(ctx, this.attack2Image, frameX,
            this.attack2SpriteWidth, this.attack2SpriteHeight,
            this.attack2DisplayWidth, this.attack2DisplayHeight);
    }

    drawAttack3Sprite(ctx) {
        let frameX = this.currentAttack3Frame * this.attack3SpriteWidth;
        this.drawSprite(ctx, this.attack3Image, frameX,
            this.attack3SpriteWidth, this.attack3SpriteHeight,
            this.attack3DisplayWidth, this.attack3DisplayHeight);
    }

    drawDeathSprite(ctx) {
        let frameX = this.currentDeathFrame * this.deathSpriteWidth;
        this.drawSprite(ctx, this.deathImage, frameX,
            this.deathSpriteWidth, this.deathSpriteHeight,
            this.deathDisplayWidth, this.deathDisplayHeight);
    }

    animate() {
        // Animation updates (60 FPS for smoother animations)
        setInterval(() => {
            // Check if game is paused
            if (this.world && this.world.isPaused) return;
            
            this.updateIdleAnimation();
            this.updateWalkAnimation();
            this.updateHitAnimation();
            this.updateAttack2Animation();
            this.updateAttack3Animation();
            this.updateDeathAnimation();
        }, 1000 / 60);
    }

    // Attack Character wenn in Reichweite
    tryAttack(character) {
        if (this.isDead || this.isAttacking2 || this.isAttacking3) return;

        let distance = Math.abs(this.x - character.x);
        if (distance <= this.attackRange) {
            this.executeRandomAttack();
        }
    }

    executeRandomAttack() {
        let now = Date.now();
        let useAttack3 = Math.random() > 0.5;

        if (useAttack3 && this.canUseAttack3(now)) {
            this.startAttack3(now);
        } else if (!useAttack3 && this.canUseAttack2(now)) {
            this.startAttack2(now);
        }
    }

    canUseAttack3(now) {
        return now - this.lastAttack3Time >= this.attack3Cooldown;
    }

    startAttack3(now) {
        this.isAttacking3 = true;
        this.currentAttack3Frame = 0;
        this.lastAttack3Time = now;
    }

    canUseAttack2(now) {
        return now - this.lastAttack2Time >= this.attack2Cooldown;
    }

    startAttack2(now) {
        this.isAttacking2 = true;
        this.currentAttack2Frame = 0;
        this.lastAttack2Time = now;
    }

    // Schaden an Character zufügen bei Attack-Frame
    dealDamageToCharacter(damage) {
        if (!this.world || !this.world.character) return;

        let distance = Math.abs(this.x - this.world.character.x);

        // Prüfe ob Character noch in Reichweite ist
        if (distance <= this.attackRange + 30) { // +30px Toleranz
            this.world.character.takeAttackDamage(damage);
            console.log(`Endboss dealt ${damage} damage to character!`);
        }
    }

    playTakeHitAnimation() {
        if (this.isDead || this.isTakingHit) return;
        this.isTakingHit = true;
        this.currentHitFrame = 0;
    }

    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.currentDeathFrame = 0;
        this.deathAnimationFinished = false;
        console.log('Endboss died!');
    }

    // Debug: Draw collision frame
    drawFrame(ctx) {
        if (!CONFIG.SHOW_COLLISION_BOXES) return;

        // Collision box (gelb)
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'yellow';
        ctx.rect(
            this.x + this.collisionOffsetX,
            this.y + this.collisionOffsetY,
            this.collisionWidth,
            this.collisionHeight
        );
        ctx.stroke();
    }

}