class Projectile extends MovableObject {
    width = 80;
    height = 80;
    speed = 8;
    damage = 0;
    projectileType = 1;

    currentFrame = 0;
    frameWidth = 64;
    frameHeight = 128;
    frameCount = 8;
    animationSpeed = 80;
    lastFrameTime = Date.now();

    collisionOffsetX = 20;
    collisionOffsetY = 20;
    collisionWidth = 40;
    collisionHeight = 40;

    hasHit = false;
    markedForDeletion = false;
    animationIntervalId;

    /**
     * Creates a new projectile with specified properties and direction
     * @function constructor
     * @param {number} x - Starting x position
     * @param {number} y - Starting y position
     * @param {number} direction - Movement direction (-1 for left, 1 for right)
     * @param {number} projectileType - Type of projectile (1 or 2)
     * @param {number} damage - Damage amount
     * @returns {void}
     */
    constructor(x, y, direction, projectileType, damage) {
        super();
        this.x = x;
        this.y = y;
        this.otherDirection = direction < 0;
        this.projectileType = projectileType;
        this.damage = damage;

        if (projectileType === 1) {
            this.loadProjectileImage('./assets/wizard_assets/Wanderer Magican/Charge_1.png');
            this.frameCount = 9;
            this.frameWidth = 64;
        } else if (projectileType === 2) {
            this.loadProjectileImage('./assets/wizard_assets/Wanderer Magican/Charge_2.png');
            this.frameCount = 6;
            this.frameWidth = 64;
        }

        this.animate();
    }

    /**
     * Loads the projectile sprite image from the specified path
     * @function loadProjectileImage
     * @param {string} path - Path to the projectile image file
     * @returns {void}
     */
    loadProjectileImage(path) {
        this.projectileImage = new Image();
        this.projectileImage.src = path;
    }

    /**
     * Starts the projectile animation and movement loop
     * @function animate
     * @returns {void}
     */
    animate() {
        let self = this;
        this.animationIntervalId = setInterval(function() {
            if (self.world && self.world.isPaused) return;

            self.updateAnimation();
            self.move();
        }, 1000 / 60);
    }

    /**
     * Updates the projectile animation frame
     * @function updateAnimation
     * @returns {void}
     */
    updateAnimation() {
        let now = Date.now();
        if (now - this.lastFrameTime > this.animationSpeed) {
            this.currentFrame++;
            if (this.currentFrame >= this.frameCount) {
                this.currentFrame = 0;
            }
            this.lastFrameTime = now;
        }
    }

    /**
     * Moves the projectile horizontally and marks for deletion if out of bounds
     * @function move
     * @returns {void}
     */
    move() {
        if (this.hasHit) return;

        if (this.otherDirection) {
            this.x -= this.speed;
        } else {
            this.x += this.speed;
        }

        if (this.x < -200 || this.x > 6000) {
            this.markedForDeletion = true;
        }
    }

    /**
     * Draws the projectile sprite with direction handling
     * @function drawProjectileSprite
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    drawProjectileSprite(ctx) {
        if (!this.projectileImage || !this.projectileImage.complete) return;

        let frameX = this.currentFrame * this.frameWidth;

        if (this.otherDirection) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.projectileImage,
                frameX, 0,
                this.frameWidth, this.frameHeight,
                -this.x - this.width, this.y,
                this.width, this.height
            );
            ctx.restore();
        } else {
            ctx.drawImage(
                this.projectileImage,
                frameX, 0,
                this.frameWidth, this.frameHeight,
                this.x, this.y,
                this.width, this.height
            );
        }
    }

    /**
     * Marks the projectile as hit and schedules for deletion
     * @function hit
     * @returns {void}
     */
    hit() {
        this.hasHit = true;
        this.markedForDeletion = true;
        this.cleanup();
    }

    /**
     * Cleans up animation intervals to prevent memory leaks
     * @function cleanup
     * @returns {void}
     */
    cleanup() {
        if (this.animationIntervalId) {
            clearInterval(this.animationIntervalId);
            this.animationIntervalId = null;
        }
    }

    /**
     * Draws debug collision frame for development purposes
     * @function drawFrame
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    drawFrame(ctx) {
        if (!CONFIG.SHOW_COLLISION_BOXES) return;

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
