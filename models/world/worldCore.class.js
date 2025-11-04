class World {
    character = new Character();
    level = createLevel1();
    projectiles = [];

    healthBar = new HealthBar(20, 10);
    manaBar = new ManaBar(20, 10);
    bossHealthBar = new BossHealthBar(300, 10);

    canvas;
    ctx;
    keyboard;
    camera_x = -100;

    maxScrollsOnMap = 3;
    scrollSpawnCooldown = 10000;
    lastScrollSpawnTime = 0;

    endbossSpawned = false;
    endbossSpawnX = 3600;

    gameOverTriggered = false;
    victoryTriggered = false;

    isPaused = false;

    scrollSpawnIntervalId;
    collisionCheckIntervalId;

    /**
     * Creates a new World instance and initializes the game
     * @function constructor
     * @param {HTMLCanvasElement} canvas - The canvas element for rendering
     * @param {Object} keyboard - The keyboard input handler
     * @returns {void}
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.checkCollisions();
        this.startScrollSpawning();
    }

    /**
     * Sets the world reference for character and enemies
     * @function setWorld
     * @returns {void}
     */
    setWorld() {
        this.character.world = this;

        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }

    /**
     * Adds a projectile to the world's projectile array
     * @function addProjectile
     * @param {Object} projectile - The projectile to add
     * @returns {void}
     */
    addProjectile(projectile) {
        this.projectiles.push(projectile);
    }

    /**
     * Removes projectiles marked for deletion from the world
     * @function cleanupProjectiles
     * @returns {void}
     */
    cleanupProjectiles() {
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);
    }

    /**
     * Cleans up all world resources and stops all intervals
     * @function cleanup
     * @returns {void}
     */
    cleanup() {
        this.clearIntervals();
        this.cleanupCharacter();
        this.cleanupEnemies();
        this.stopAllProjectiles();
    }

    /**
     * Clears all active intervals to prevent memory leaks
     * @function clearIntervals
     * @returns {void}
     */
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

    /**
     * Cleans up the character object
     * @function cleanupCharacter
     * @returns {void}
     */
    cleanupCharacter() {
        if (this.character && this.character.cleanup) {
            this.character.cleanup();
        }
    }

    /**
     * Cleans up all enemy objects
     * @function cleanupEnemies
     * @returns {void}
     */
    cleanupEnemies() {
        this.level.enemies.forEach(enemy => {
            if (enemy.cleanup) {
                enemy.cleanup();
            }
        });
    }

    /**
     * Stops and cleans up all projectiles
     * @function stopAllProjectiles
     * @returns {void}
     */
    stopAllProjectiles() {
        this.projectiles.forEach(projectile => {
            if (projectile.cleanup) {
                projectile.cleanup();
            }
        });
    }
}
