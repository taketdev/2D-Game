class FlyingEye extends MovableObject {
    // Position and Size (höher als Goblin, da fliegend)
    y = 50;
    height = 250;
    width = 250;

    // Health System
    maxHP = 20;
    currentHP = 20;
    isDead = false;

    // Collision Box (angepasst an tatsächlichen Körper - zentriert)
    collisionOffsetX = 85;
    collisionOffsetY = 90;
    collisionWidth = 70;
    collisionHeight = 70;

    // Flight Animation Properties
    flightImage;
    currentFlightFrame = 0;
    flightSpriteWidth = 150;
    flightSpriteHeight = 150;
    flightFrameCount = 8;
    flightDisplayWidth = 250;
    flightDisplayHeight = 250;
    flightAnimationSpeed = 80;
    lastFlightFrameTime = Date.now();

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

    // Wave Movement (Sinus-Kurve)
    startY; // Ursprüngliche Y-Position
    waveAmplitude = 50; // Höhe der Welle (50px hoch/runter)
    waveFrequency = 0.03; // Geschwindigkeit der Welle
    waveOffset = 0; // Aktueller Offset für Sinus

    // AI Behavior
    turnTowardsCharacter = true; // Aktiviert automatisches Drehen zum Character
    attackRange = 100; // 100px Reichweite für Attack
    attackCooldown = 2500; // 2.5 Sekunden Cooldown zwischen Attacks
    lastAttackTime = 0;

    // Death Physics
    isFalling = false;
    fallSpeed = 0;
    fallAcceleration = 0.5;
    groundY = 250; // Boden-Position (gleich wie Goblin y-Position)

    constructor() {
        super();
        this.loadFlightImage('./assets/monsters/Flying eye/Flight.png');
        this.loadAttackImage('./assets/monsters/Flying eye/Attack.png');
        this.loadDeathImage('./assets/monsters/Flying eye/Death.png');

        // Random position and speed (langsamer, angepasst an Character)
        this.x = 300 + Math.random() * 600;
        this.startY = 50 + Math.random() * 100; // Random Höhe zwischen 50-150
        this.y = this.startY;
        this.speed = 0.6 + Math.random() * 0.6;
        this.waveOffset = Math.random() * Math.PI * 2; // Random start in wave
        this.otherDirection = true; // Sprite spiegeln, damit er richtig herum fliegt

        this.animate();
        this.moveWithWave();
    }

    loadFlightImage(path) {
        this.flightImage = new Image();
        this.flightImage.src = path;
    }

    loadAttackImage(path) {
        this.attackImage = new Image();
        this.attackImage.src = path;
    }

    loadDeathImage(path) {
        this.deathImage = new Image();
        this.deathImage.src = path;
    }

    updateFlightAnimation() {
        let now = Date.now();
        if (now - this.lastFlightFrameTime > this.flightAnimationSpeed) {
            this.currentFlightFrame++;
            if (this.currentFlightFrame >= this.flightFrameCount) {
                this.currentFlightFrame = 0;
            }
            this.lastFlightFrameTime = now;
        }
    }

    updateAttackAnimation() {
        if (!this.isAttacking) return;

        let now = Date.now();
        if (now - this.lastAttackFrameTime > this.attackAnimationSpeed) {
            this.advanceAttackFrame(now);
        }
    }

    advanceAttackFrame(now) {
        this.currentAttackFrame++;

        if (this.currentAttackFrame === this.attackHitFrame && this.world) {
            this.dealDamageToCharacter();
        }

        if (this.currentAttackFrame >= this.attackFrameCount) {
            this.endAttackAnimation();
        }
        this.lastAttackFrameTime = now;
    }

    endAttackAnimation() {
        this.isAttacking = false;
        this.currentAttackFrame = 0;
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

    drawFlightSprite(ctx) {
        let frameX = this.currentFlightFrame * this.flightSpriteWidth;
        this.drawSprite(ctx, this.flightImage, frameX,
            this.flightSpriteWidth, this.flightSpriteHeight,
            this.flightDisplayWidth, this.flightDisplayHeight);
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

    moveWithWave() {
        setInterval(() => {
            if (this.world && this.world.isPaused) return;

            if (this.handleDeathFalling()) return;
            if (this.isDead) return;

            this.updateHorizontalMovement();
            this.updateWaveMovement();
        }, 1000 / 60);
    }

    handleDeathFalling() {
        if (this.isDead && !this.isFalling) {
            this.isFalling = true;
            this.fallSpeed = 0;
        }

        if (this.isFalling) {
            this.applyFallingGravity();
            return true;
        }

        return false;
    }

    applyFallingGravity() {
        if (this.y < this.groundY) {
            this.fallSpeed += this.fallAcceleration;
            this.y += this.fallSpeed;

            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.isFalling = false;
            }
        }
    }

    updateHorizontalMovement() {
        this.x -= this.speed;
    }

    updateWaveMovement() {
        this.waveOffset += this.waveFrequency;
        this.y = this.startY + Math.sin(this.waveOffset) * this.waveAmplitude;
    }

    animate() {
        // Animation updates (60 FPS for smoother animations)
        setInterval(() => {
            // Check if game is paused
            if (this.world && this.world.isPaused) return;
            
            this.updateFlightAnimation();
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
            this.world.character.takeAttackDamage(CONFIG.DAMAGE.FLYING_EYE_ATTACK);
            console.log('Flying Eye dealt damage to character!');
        }
    }

    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.currentDeathFrame = 0;
        this.deathAnimationFinished = false;
        this.speed = 0; // Stop movement
        console.log('Flying Eye died!');
    }

    // Debug: Draw collision frame
    drawFrame(ctx) {
        if (!CONFIG.SHOW_COLLISION_BOXES) return;

        // Collision box (cyan)
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'cyan';
        ctx.rect(
            this.x + this.collisionOffsetX,
            this.y + this.collisionOffsetY,
            this.collisionWidth,
            this.collisionHeight
        );
        ctx.stroke();
    }
}
