class World {
    // Game Objects
    character = new Character();
    level = level1;
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

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    setWorld() {
        this.character.world = this;
    }

    checkCollisions() {
        setInterval(() => {
            this.checkEnemyCollisions();
            this.checkProjectileCollisions();
            this.cleanupProjectiles();
        }, 1000 / 60);
    }

    checkEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (enemy.isDead) return; // Tote Enemies ignorieren

            if (this.character.isColliding(enemy)) {
                // Bestimme Schaden basierend auf Enemy-Typ
                let damage = 0;
                if (enemy instanceof Endboss) {
                    damage = CONFIG.DAMAGE.ENDBOSS_CONTACT;
                } else if (enemy instanceof Goblin) {
                    damage = CONFIG.DAMAGE.GOBLIN_CONTACT;
                } else if (enemy instanceof FlyingEye) {
                    damage = CONFIG.DAMAGE.FLYING_EYE_CONTACT;
                }

                // Knockback und Schaden anwenden
                this.character.applyKnockback(enemy.x, damage);
            }
        });
    }

    checkProjectileCollisions() {
        this.projectiles.forEach(projectile => {
            if (projectile.hasHit) return; // Bereits getroffenes Projektil ignorieren

            this.level.enemies.forEach(enemy => {
                if (enemy.isDead) return; // Tote Enemies ignorieren

                if (projectile.isColliding(enemy)) {
                    // Projektil hat Gegner getroffen
                    enemy.takeDamage(projectile.damage);
                    projectile.hit(); // Markiere Projektil als getroffen
                }
            });
        });
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

        // Character (verschiedene Animationen) - Attack hat Priorität
        if (this.character.isDead) {
            this.character.drawDeathSprite(this.ctx);
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
        // Update StatusBar Prozente basierend auf Character Werten
        let healthPercentage = (this.character.currentHP / this.character.maxHP) * 100;
        let manaPercentage = (this.character.currentMana / this.character.maxMana) * 100;

        this.healthBar.setPercentage(healthPercentage);
        this.manaBar.setPercentage(manaPercentage);

        // Zeichne StatusBars
        this.healthBar.draw(this.ctx);
        this.manaBar.draw(this.ctx);

        // Zeichne Boss Health Bar nur wenn Endboss in Sichtweite
        this.drawBossHealthBar();
    }

    drawBossHealthBar() {
        // Finde Endboss im Level
        let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);

        if (!endboss || endboss.isDead) return;

        // Prüfe ob Endboss in Sichtweite (innerhalb des Canvas)
        let endbossScreenX = endboss.x + this.camera_x;
        let isInView = endbossScreenX + endboss.width > -100 && endbossScreenX < this.canvas.width + 100;

        if (isInView) {
            let bossHealthPercentage = (endboss.currentHP / endboss.maxHP) * 100;
            this.bossHealthBar.setPercentage(bossHealthPercentage);
            this.bossHealthBar.draw(this.ctx);
        }
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        // Check if object is Endboss with sprite animations
        if (mo instanceof Endboss) {
            if (mo.isDead) {
                mo.drawDeathSprite(this.ctx);
            } else if (mo.isWalking) {
                mo.drawWalkSprite(this.ctx);
            } else {
                mo.drawIdleSprite(this.ctx);
            }
        }
        // Check if object is Goblin with sprite animations
        else if (mo instanceof Goblin) {
            if (mo.isDead) {
                mo.drawDeathSprite(this.ctx);
            } else if (mo.isRunning) {
                mo.drawRunSprite(this.ctx);
            } else {
                mo.drawIdleSprite(this.ctx);
            }
        }
        // Check if object is Flying Eye with sprite animations
        else if (mo instanceof FlyingEye) {
            if (mo.isDead) {
                mo.drawDeathSprite(this.ctx);
            } else {
                mo.drawFlightSprite(this.ctx);
            }
        }
        else {
            // Normal rendering for other objects (Chicken, Clouds, Background)
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
    }

    drawCollisionFrames() {
        // Draw collision frames for all enemies
        this.level.enemies.forEach(enemy => {
            if (enemy.drawFrame) {
                enemy.drawFrame(this.ctx);
            }
        });
    }
}