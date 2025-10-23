class Character extends MovableObject {
    // Character Properties
    width = 200;
    height = 200;
    y = 165;
    speed = 3;
    world;

    // Health System
    maxHP = 100;
    currentHP = 100;
    isDead = false;

    // Mana System
    maxMana = 100;
    currentMana = 100;
    manaCostPerSpell = 20; // 20 Mana pro Zauber
    manaRegenRate = 5; // 5 Mana pro Sekunde

    // Collision Box (angepasst an tatsächlichen Körper - zentriert)
    collisionOffsetX = 60;
    collisionOffsetY = 90;
    collisionWidth = 80;
    collisionHeight = 115;

    // Knockback Properties
    isKnockedBack = false;
    knockbackForce = 0;
    knockbackDirection = 1; // 1 = rechts, -1 = links
    invulnerable = false;
    invulnerableTime = 1000; // 1 Sekunde Unverwundbarkeit
    lastHitTime = 0;

    // Idle
    idleFrame;
    currentIdleFrame = 1;
    idleSpriteWidth = 128;   
    idleSpriteHeight = 128;  
    idleDisplayWidth = 200;  
    idleDisplayHeight = 200; 
    idleAnimationSpeed = 200;
    lastIdleFrameTime = Date.now();
    isIdle = true;
    isRunning = false;

    // Walk
    walkImage;
    currentWalkFrame = 0;
    walkFrameWidth = 128;
    walkFrameHeight = 128;
    walkframeCount = 7;
    walkFrameCount = 0;
    walkAnimationSpeed = 150;
    lastWalkFrameTime= Date.now();
    walkDisplayWidth = 200;
    walkDisplayHeight = 200;

    // Jump
    jumpImage;
    currentJumpFrame = 3;
    jumpFrameWidth = 128;
    jumpFrameHeight = 128;
    jumpFrameCount = 8;
    jumpAnimationSpeed = 200;
    lastJumpFrameTime = Date.now();
    jumpDisplayWidth = 200;
    jumpDisplayHeight = 200;

    // Run
    runImage;
    currentRunFrame = 0;
    runFrameWidth = 128;
    runFrameHeight = 128;
    runFrameCount = 8;  // Anzahl der Frames im Run-Spritesheet
    runAnimationSpeed = 80;  // Schneller als Walk (80ms statt 100ms)
    lastRunFrameTime = Date.now();
    runDisplayWidth = 200;
    runDisplayHeight = 200;

    // Hurt
    hurtImage;
    currentHurtFrame = 0;
    hurtFrameWidth = 128;
    hurtFrameHeight = 128;
    hurtFrameCount = 3;
    hurtDisplayWidth = 200;
    hurtDisplayHeight = 200;
    hurtAnimationSpeed = 100;
    lastHurtFrameTime = Date.now();
    isHurt = false;

    // Death
    deathImage;
    currentDeathFrame = 0;
    deathFrameWidth = 128;
    deathFrameHeight = 128;
    deathFrameCount = 4;
    deathDisplayWidth = 200;
    deathDisplayHeight = 200;
    deathAnimationSpeed = 150;
    lastDeathFrameTime = Date.now();
    deathAnimationFinished = false;

    // Attack 1 (D key) - Charge_1 Projektil
    attack1Image;
    currentAttack1Frame = 0;
    attack1FrameWidth = 128; // 896 / 7 = 128
    attack1FrameHeight = 128;
    attack1FrameCount = 7; // 0-6
    attack1DisplayWidth = 200;
    attack1DisplayHeight = 200;
    attack1AnimationSpeed = 80;
    lastAttack1FrameTime = Date.now();
    isAttacking1 = false;
    attack1Cooldown = 300; // 300ms Cooldown
    lastAttack1Time = 0;
    attack1ProjectileSpawned = false; // Flag für Projektil bei Frame 3

    // Attack 2 (E key) - Charge_2 Projektil
    attack2Image;
    currentAttack2Frame = 0;
    attack2FrameWidth = 128; // 1152 / 9 = 128
    attack2FrameHeight = 128;
    attack2FrameCount = 9; // 0-8
    attack2DisplayWidth = 200;
    attack2DisplayHeight = 200;
    attack2AnimationSpeed = 80;
    lastAttack2FrameTime = Date.now();
    isAttacking2 = false;
    attack2Cooldown = 500; // 500ms Cooldown
    lastAttack2Time = 0;
    attack2ProjectileSpawned = false; // Flag für Projektil bei Frame 6


    constructor() {
        super();
        this.loadIdleImage('./assets/wizard_assets/Wanderer Magican/Idle.png');
        this.loadWalkImage('./assets/wizard_assets/Wanderer Magican/Walk.png');
        this.loadJumpImage('./assets/wizard_assets/Wanderer Magican/Jump.png');
        this.loadRunImage('./assets/wizard_assets/Wanderer Magican/Run.png');
        this.loadHurtImage('./assets/wizard_assets/Wanderer Magican/Hurt.png');
        this.loadDeathImage('./assets/wizard_assets/Wanderer Magican/Dead.png');
        this.loadAttack1Image('./assets/wizard_assets/Wanderer Magican/Attack_1.png');
        this.loadAttack2Image('./assets/wizard_assets/Wanderer Magican/Attack_2.png');
        this.animate();
        this.applyGravity();
    }

    loadIdleImage(path) {
        this.idleImage = new Image();
        this.idleImage.src = path;
    }

    loadWalkImage(path) {
        this.walkImage = new Image();
        this.walkImage.src = path;
    }

    loadJumpImage(path) {
        this.jumpImage = new Image();
        this.jumpImage.src = path;
    }

    loadRunImage(path) {
        this.runImage = new Image();
        this.runImage.src = path;
    }

    loadHurtImage(path) {
        this.hurtImage = new Image();
        this.hurtImage.src = path;
    }

    loadDeathImage(path) {
        this.deathImage = new Image();
        this.deathImage.src = path;
    }

    loadAttack1Image(path) {
        this.attack1Image = new Image();
        this.attack1Image.src = path;
    }

    loadAttack2Image(path) {
        this.attack2Image = new Image();
        this.attack2Image.src = path;
    }

    // Update animations
    updateIdleAnimation() {
        let now = Date.now();
        if (now - this.lastIdleFrameTime > this.idleAnimationSpeed) {
            this.currentIdleFrame++;
            if (this.currentIdleFrame > 7) {
                this.currentIdleFrame = 1;
            }
            this.lastIdleFrameTime = now;
        }
    }

    updateWalkAnimation() {
        let now = Date.now();
        if (now - this.lastWalkFrameTime > this.walkAnimationSpeed) {
            this.currentWalkFrame++;
            if (this.currentWalkFrame >= this.walkframeCount) {
                this.currentWalkFrame = 0;
            }
            this.lastWalkFrameTime = now;
        }
    }

    updateJumpAnimation() {
        let now = Date.now();
        if (now - this.lastJumpFrameTime > this.jumpAnimationSpeed) {
            if (this.currentJumpFrame < 5) {  // Nur bis Frame 7 animieren
                this.currentJumpFrame++;
            }
            // stop at frame 7 - not other animations
            this.lastJumpFrameTime = now;
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

    updateHurtAnimation() {
        if (!this.isHurt) return;

        let now = Date.now();
        if (now - this.lastHurtFrameTime > this.hurtAnimationSpeed) {
            this.currentHurtFrame++;
            if (this.currentHurtFrame >= this.hurtFrameCount) {
                this.isHurt = false;
                this.currentHurtFrame = 0;
            }
            this.lastHurtFrameTime = now;
        }
    }

    updateDeathAnimation() {
        if (this.deathAnimationFinished) return;

        let now = Date.now();
        if (now - this.lastDeathFrameTime > this.deathAnimationSpeed) {
            this.currentDeathFrame++;
            if (this.currentDeathFrame >= this.deathFrameCount) {
                this.currentDeathFrame = this.deathFrameCount - 1; // Letzten Frame halten
                this.deathAnimationFinished = true;
            }
            this.lastDeathFrameTime = now;
        }
    }

    updateAttack1Animation() {
        if (!this.isAttacking1) return;

        let now = Date.now();
        if (now - this.lastAttack1FrameTime > this.attack1AnimationSpeed) {
            this.currentAttack1Frame++;

            // Spawne Projektil bei Frame 3
            if (this.currentAttack1Frame === 3 && !this.attack1ProjectileSpawned) {
                this.spawnProjectile(1); // Typ 1 = Charge_1
                this.attack1ProjectileSpawned = true;
            }

            // Animation beenden
            if (this.currentAttack1Frame >= this.attack1FrameCount) {
                this.isAttacking1 = false;
                this.currentAttack1Frame = 0;
                this.attack1ProjectileSpawned = false;
            }
            this.lastAttack1FrameTime = now;
        }
    }

    updateAttack2Animation() {
        if (!this.isAttacking2) return;

        let now = Date.now();
        if (now - this.lastAttack2FrameTime > this.attack2AnimationSpeed) {
            this.currentAttack2Frame++;

            // Spawne Projektil bei Frame 6
            if (this.currentAttack2Frame === 6 && !this.attack2ProjectileSpawned) {
                this.spawnProjectile(2); // Typ 2 = Charge_2
                this.attack2ProjectileSpawned = true;
            }

            // Animation beenden
            if (this.currentAttack2Frame >= this.attack2FrameCount) {
                this.isAttacking2 = false;
                this.currentAttack2Frame = 0;
                this.attack2ProjectileSpawned = false;
            }
            this.lastAttack2FrameTime = now;
        }
    }

    drawSprite(ctx, image, frameX, frameWidth, frameHeight, displayWidth, displayHeight) {
        if (!image || !image.complete) return;

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
    }

    drawIdleSprite(ctx) {
        let frameX = this.currentIdleFrame * this.idleSpriteWidth;
        this.drawSprite(ctx, this.idleImage, frameX,
            this.idleSpriteWidth, this.idleSpriteHeight,
            this.idleDisplayWidth, this.idleDisplayHeight);
    }

    drawWalkSprite(ctx) {
        let frameX = this.currentWalkFrame * this.walkFrameWidth;
        this.drawSprite(ctx, this.walkImage, frameX,
            this.walkFrameWidth, this.walkFrameHeight,
            this.walkDisplayWidth, this.walkDisplayHeight);
    }

    drawJumpSprite(ctx) {
        let frameX = this.currentJumpFrame * this.jumpFrameWidth;
        this.drawSprite(ctx, this.jumpImage, frameX,
            this.jumpFrameWidth, this.jumpFrameHeight,
            this.jumpDisplayWidth, this.jumpDisplayHeight);
    }

    drawRunSprite(ctx) {
        let frameX = this.currentRunFrame * this.runFrameWidth;
        this.drawSprite(ctx, this.runImage, frameX,
            this.runFrameWidth, this.runFrameHeight,
            this.runDisplayWidth, this.runDisplayHeight);
    }

    drawHurtSprite(ctx) {
        let frameX = this.currentHurtFrame * this.hurtFrameWidth;
        this.drawSprite(ctx, this.hurtImage, frameX,
            this.hurtFrameWidth, this.hurtFrameHeight,
            this.hurtDisplayWidth, this.hurtDisplayHeight);
    }

    drawDeathSprite(ctx) {
        let frameX = this.currentDeathFrame * this.deathFrameWidth;
        this.drawSprite(ctx, this.deathImage, frameX,
            this.deathFrameWidth, this.deathFrameHeight,
            this.deathDisplayWidth, this.deathDisplayHeight);
    }

    drawAttack1Sprite(ctx) {
        let frameX = this.currentAttack1Frame * this.attack1FrameWidth;
        this.drawSprite(ctx, this.attack1Image, frameX,
            this.attack1FrameWidth, this.attack1FrameHeight,
            this.attack1DisplayWidth, this.attack1DisplayHeight);
    }

    drawAttack2Sprite(ctx) {
        let frameX = this.currentAttack2Frame * this.attack2FrameWidth;
        this.drawSprite(ctx, this.attack2Image, frameX,
            this.attack2FrameWidth, this.attack2FrameHeight,
            this.attack2DisplayWidth, this.attack2DisplayHeight);
    }

    animate() {
        // Movement and controls (60 FPS)
        setInterval(() => {
            this.updateKnockback();
            this.handleMovement();
            this.updateCamera();
            this.updateAttack1Animation();
            this.updateAttack2Animation();
        }, 1000 / 60);

        // Animation updates (10 FPS)
        setInterval(() => {
            this.updateIdleAnimation();
            this.updateWalkAnimation();
            this.updateJumpAnimation();
            this.updateRunAnimation();
            this.updateHurtAnimation();
            this.updateDeathAnimation();
        }, 100);

        // Mana Regeneration (jede Sekunde)
        setInterval(() => {
            this.regenerateMana();
        }, 1000);
    }

    playTakeHitAnimation() {
        if (this.isDead || this.isHurt) return;
        this.isHurt = true;
        this.currentHurtFrame = 0;
    }

    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.currentDeathFrame = 0;
        this.deathAnimationFinished = false;
        console.log('Character died!');
    }

handleMovement() {
    if (!this.world) return;

    // Blockiere Bewegung wenn Character tot ist
    if (this.isDead) return;

    // Attack 1 (D key) - nur wenn nicht bereits am Attackieren
    if (this.world.keyboard.D && !this.isAttacking1 && !this.isAttacking2) {
        let now = Date.now();
        if (now - this.lastAttack1Time >= this.attack1Cooldown) {
            this.attack1();
            this.lastAttack1Time = now;
        }
    }

    // Attack 2 (E key) - nur wenn nicht bereits am Attackieren
    if (this.world.keyboard.E && !this.isAttacking1 && !this.isAttacking2) {
        let now = Date.now();
        if (now - this.lastAttack2Time >= this.attack2Cooldown) {
            this.attack2();
            this.lastAttack2Time = now;
        }
    }

    // Blockiere Bewegung während Attack
    if (this.isAttacking1 || this.isAttacking2) return;

    // Checken ob irgendwas gedrückt wird
    let isMoving = false;
    let isRunning = false;

    // Check if Shift is pressed for running
    if (this.world.keyboard.SHIFT) {
        isRunning = true;
    }

    // Move right
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        let moveSpeed = isRunning ? this.speed * 2 : this.speed; // Doppelte Geschwindigkeit beim Rennen
        this.x += moveSpeed;
        this.otherDirection = false;
        isMoving = true;
    }

    // Move left
    if (this.world.keyboard.LEFT && this.x > this.world.level.level_start_x) {
        let moveSpeed = isRunning ? this.speed * 2 : this.speed; // Doppelte Geschwindigkeit beim Rennen
        this.x -= moveSpeed;
        this.otherDirection = true;
        isMoving = true;
    }

    // Jump (Space or Up arrow)
    if (this.world.keyboard.SPACE || this.world.keyboard.UP) {
        this.jump();
        isMoving = true;
    }

    // Setze Status
    this.isIdle = !isMoving && !this.isAboveGround();
    this.isRunning = isRunning && isMoving && !this.isAboveGround();
}

    updateCamera() {
        if (this.world) {
            this.world.camera_x = -this.x + 100;
        }
    }

    jump() {
        if (!this.isAboveGround()) {
            this.speedY = 15;   // Jump force upward
            this.currentJumpFrame = 3;  // start at frame 3
        }
    }

    // Pushback bei Kollision - nur sanftes Wegschieben, KEIN Schaden
    applyPushback(enemyX) {
        if (this.isDead || this.isKnockedBack) return;

        this.isKnockedBack = true;

        // Bestimme Pushback-Richtung basierend auf Enemy-Position
        if (this.x < enemyX) {
            this.knockbackDirection = -1; // Nach links
        } else {
            this.knockbackDirection = 1; // Nach rechts
        }

        this.knockbackForce = 2; // Sanftes Wegschieben

        // Pushback-Effekt nach 150ms beenden
        setTimeout(() => {
            this.isKnockedBack = false;
            this.knockbackForce = 0;
        }, 150);
    }

    // Schaden nehmen (wird von Enemy-Attacken aufgerufen)
    takeAttackDamage(damage) {
        if (this.invulnerable || this.isDead) return;

        this.takeDamage(damage);
        this.invulnerable = true;

        // Unverwundbarkeit nach 1 Sekunde beenden
        setTimeout(() => {
            this.invulnerable = false;
        }, this.invulnerableTime);
    }

    updateKnockback() {
        if (this.isKnockedBack && this.knockbackForce > 0) {
            this.x += this.knockbackDirection * this.knockbackForce;
            this.knockbackForce *= 0.7; // Schneller abbremsen (statt 0.85)
        }
    }

    // Attack 1 initiieren
    attack1() {
        if (this.isAttacking1 || this.isAttacking2) return;
        if (!this.hasMana()) return; // Prüfe Mana

        this.useMana(); // Verbrauche Mana
        this.isAttacking1 = true;
        this.currentAttack1Frame = 0;
        this.attack1ProjectileSpawned = false;
    }

    // Attack 2 initiieren
    attack2() {
        if (this.isAttacking1 || this.isAttacking2) return;
        if (!this.hasMana()) return; // Prüfe Mana

        this.useMana(); // Verbrauche Mana
        this.isAttacking2 = true;
        this.currentAttack2Frame = 0;
        this.attack2ProjectileSpawned = false;
    }

    // Mana System Methoden
    hasMana() {
        return this.currentMana >= this.manaCostPerSpell;
    }

    useMana() {
        if (this.currentMana >= this.manaCostPerSpell) {
            this.currentMana -= this.manaCostPerSpell;
            console.log(`Mana used. Current Mana: ${this.currentMana}/${this.maxMana}`);
        }
    }

    regenerateMana() {
        if (this.isDead) return; // Keine Regeneration wenn tot

        if (this.currentMana < this.maxMana) {
            this.currentMana += this.manaRegenRate;

            // Verhindere dass Mana über Maximum geht
            if (this.currentMana > this.maxMana) {
                this.currentMana = this.maxMana;
            }
        }
    }

    // Spawn Projektil
    spawnProjectile(type) {
        if (!this.world) return;

        // Bestimme Schaden basierend auf Projektil-Typ
        let damage = type === 1 ? 15 : 25; // Attack 1: 15 Schaden, Attack 2: 25 Schaden

        // Berechne Spawn-Position (vor dem Character)
        let projectileX = this.otherDirection ? this.x + 20 : this.x + this.width - 60;
        let projectileY = this.y + 60; // Ungefähr auf Brusthöhe

        // Richtung: 1 = rechts, -1 = links
        let direction = this.otherDirection ? -1 : 1;

        // Erstelle Projektil
        let projectile = new Projectile(projectileX, projectileY, direction, type, damage);

        // Füge zur World hinzu
        this.world.addProjectile(projectile);
    }

    // Debug: Draw collision frame
    drawFrame(ctx) {
        if (!CONFIG.SHOW_COLLISION_BOXES) return;

        // Collision box (rot)
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.rect(
            this.x + this.collisionOffsetX,
            this.y + this.collisionOffsetY,
            this.collisionWidth,
            this.collisionHeight
        );
        ctx.stroke();
    }
}