class MovableObject {

    x = 150;
    y = 350;
    height = 100;
    width = 100;
    speed = 0.15;
    otherDirection = false;
    
    speedY = 0;
    acceleration = 1;

    img;
    imageCache = {};
    currentImage = 0;

    gravityIntervalId;
    moveLeftIntervalId;

    /**
     * Applies gravity to the object, making it fall when above ground
     * @function applyGravity
     * @returns {void}
     */
    applyGravity() {
        this.gravityIntervalId = setInterval(() => {
            if (this.world && this.world.isPaused) return;
            
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else if (this.y > 165) {
                this.y = 165;
                this.speedY = 0;
            }
        }, 1000 / 25);
    }

    /**
     * Checks if the object is above the ground level
     * @function isAboveGround
     * @returns {boolean} True if object is above ground level
     */
    isAboveGround() {
        return this.y < 165;
    }

    /**
     * Loads a single image from the specified path
     * @function loadImage
     * @param {string} path - Path to the image file
     * @returns {void}
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images from an array of paths and caches them
     * @function loadImages
     * @param {Array} arr - Array of image paths to load
     * @returns {void}
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Plays animation by cycling through an array of images
     * @function playAnimation
     * @param {Array} images - Array of image paths for animation
     * @returns {void}
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        if (this.imageCache[path]) {
            this.img = this.imageCache[path];
        }
        this.currentImage++;
    }

    /**
     * Moves the object to the right (basic implementation)
     * @function moveRight
     * @returns {void}
     */
    moveRight() {
        console.log('Moving right');
    }

    /**
     * Moves the object continuously to the left using an interval
     * @function moveLeft
     * @returns {void}
     */
    moveLeft() {
        this.moveLeftIntervalId = setInterval(() => {
            if (this.world && this.world.isPaused) return;
            
            this.x -= this.speed;
        }, 1000 / 60);
    }

    /**
     * Checks if this object is colliding with another object
     * @function isColliding
     * @param {Object} obj - Object to check collision with
     * @returns {boolean} True if objects are colliding
     */
    isColliding(obj) {
        if (obj.isDead) return false;

        const myBox = this.getCollisionBox();
        const objBox = this.getObjectCollisionBox(obj);

        return this.checkBoxesOverlap(myBox, objBox);
    }

    /**
     * Gets the collision box for this object
     * @function getCollisionBox
     * @returns {Object} Collision box with x, y, width, height properties
     */
    getCollisionBox() {
        return {
            x: this.x + (this.collisionOffsetX || 0),
            y: this.y + (this.collisionOffsetY || 0),
            width: this.collisionWidth || this.width,
            height: this.collisionHeight || this.height
        };
    }

    /**
     * Gets the collision box for another object
     * @function getObjectCollisionBox
     * @param {Object} obj - Object to get collision box for
     * @returns {Object} Collision box with x, y, width, height properties
     */
    getObjectCollisionBox(obj) {
        return {
            x: obj.x + (obj.collisionOffsetX || 0),
            y: obj.y + (obj.collisionOffsetY || 0),
            width: obj.collisionWidth || obj.width,
            height: obj.collisionHeight || obj.height
        };
    }

    /**
     * Checks if two collision boxes overlap
     * @function checkBoxesOverlap
     * @param {Object} box1 - First collision box
     * @param {Object} box2 - Second collision box
     * @returns {boolean} True if boxes overlap
     */
    checkBoxesOverlap(box1, box2) {
        return box1.x < box2.x + box2.width &&
               box1.x + box1.width > box2.x &&
               box1.y < box2.y + box2.height &&
               box1.y + box1.height > box2.y;
    }

    /**
     * Applies damage to the object and handles hit reactions
     * @function takeDamage
     * @param {number} damage - Amount of damage to apply
     * @returns {void}
     */
    takeDamage(damage) {
        if (this.isDead) return;

        this.applyDamage(damage);
        this.logDamage(damage);
        this.playHitAnimationIfAlive();
        this.checkIfDead();
    }

    /**
     * Applies damage value to current HP
     * @function applyDamage
     * @param {number} damage - Damage amount to apply
     * @returns {void}
     */
    applyDamage(damage) {
        this.currentHP -= damage;
        if (this.currentHP < 0) {
            this.currentHP = 0;
        }
    }

    /**
     * Logs damage information to console
     * @function logDamage
     * @param {number} damage - Damage amount that was applied
     * @returns {void}
     */
    logDamage(damage) {
        console.log(`${this.constructor.name} took ${damage} damage. HP: ${this.currentHP}/${this.maxHP}`);
    }

    /**
     * Plays hit animation if object is still alive
     * @function playHitAnimationIfAlive
     * @returns {void}
     */
    playHitAnimationIfAlive() {
        if (this.playTakeHitAnimation && this.currentHP > 0) {
            this.playTakeHitAnimation();
        }
    }

    /**
     * Checks if object is dead and triggers death if HP is zero
     * @function checkIfDead
     * @returns {void}
     */
    checkIfDead() {
        if (this.currentHP === 0) {
            this.die();
        }
    }

    /**
     * Handles object death by setting dead state and cleaning up
     * @function die
     * @returns {void}
     */
    die() {
        this.isDead = true;
        console.log(`${this.constructor.name} died!`);
        this.cleanup();
    }

    /**
     * Cleans up all active intervals to prevent memory leaks
     * @function cleanup
     * @returns {void}
     */
    cleanup() {
        if (this.gravityIntervalId) {
            clearInterval(this.gravityIntervalId);
            this.gravityIntervalId = null;
        }
        if (this.moveLeftIntervalId) {
            clearInterval(this.moveLeftIntervalId);
            this.moveLeftIntervalId = null;
        }
    }

    /**
     * Draws debug collision frame around the object
     * @function drawFrame
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    drawFrame(ctx) {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }
}