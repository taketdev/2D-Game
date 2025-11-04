class World {
    // Game Objects
    character = new Character();
    level = createLevel1(); // Create fresh level instance
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

    // Collectible Spawn System
    maxScrollsOnMap = 3;
    scrollSpawnCooldown = 10000; // 10 Sekunden Cooldown
    lastScrollSpawnTime = 0;

    // Endboss Spawn System
    endbossSpawned = false;
    endbossSpawnX = 3600; // Battleground2 startet bei x=3600

    // Game Over System
    gameOverTriggered = false;
    victoryTriggered = false;

    // Pause System
    isPaused = false;

    // Interval IDs für Cleanup
    scrollSpawnIntervalId;
    collisionCheckIntervalId;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.checkCollisions();
        this.startScrollSpawning();
    }

    setWorld() {
        this.character.world = this;

        // Setze World-Referenz für alle Enemies
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }

    addProjectile(projectile) {
        this.projectiles.push(projectile);
    }

    cleanupProjectiles() {
        // Entferne Projektile die zum Löschen markiert sind
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);
    }

    // Cleanup method to clear all intervals
    cleanup() {
        this.clearIntervals();
        this.cleanupCharacter();
        this.cleanupEnemies();
        this.stopAllProjectiles();
    }

    clearIntervals() {
        if (this.scrollSpawnIntervalId) {
            clearInterval(this.scrollSpawnIntervalId);
            this.scrollSpawnIntervalId = null;
        }
        if (this.collisionCheckIntervalId) {
            clearInterval(this.collisionCheckIntervalId);
            this.collisionCheckIntervalId = null;
        }
    }

    cleanupCharacter() {
        if (this.character && this.character.cleanup) {
            this.character.cleanup();
        }
    }

    cleanupEnemies() {
        this.level.enemies.forEach(enemy => {
            if (enemy.cleanup) {
                enemy.cleanup();
            }
        });
    }

    stopAllProjectiles() {
        this.projectiles.forEach(projectile => {
            if (projectile.cleanup) {
                projectile.cleanup();
            }
        });
    }
}
