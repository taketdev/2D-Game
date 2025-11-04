class Character extends MovableObject {
    // Character Properties
    width = 200;
    height = 200;
    y = 165;
    speed = 8; // Reduziert von 15 auf 8 für langsamere Bewegung
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

    // Interval IDs für Cleanup
    movementIntervalId;
    animationIntervalId;
    manaRegenIntervalId;

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
    walkFrameCount = 7;
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

    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
        this.startManaRegenerationLoop();
    }

    // Cleanup method to clear all intervals
    cleanup() {
        if (this.movementIntervalId) {
            clearInterval(this.movementIntervalId);
            this.movementIntervalId = null;
        }
        if (this.animationIntervalId) {
            clearInterval(this.animationIntervalId);
            this.animationIntervalId = null;
        }
        if (this.manaRegenIntervalId) {
            clearInterval(this.manaRegenIntervalId);
            this.manaRegenIntervalId = null;
        }
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
