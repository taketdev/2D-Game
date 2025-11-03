class MovableObject {

    x = 150;
    y = 350;
    height = 100;
    width = 100;
    speed = 0.15;
    otherDirection = false;
    
    // Physics Properties
    speedY = 0;
    acceleration = 1;

    // Image Properties
    img;
    imageCache = {};
    currentImage = 0;

    // Interval IDs für Cleanup
    gravityIntervalId;
    moveLeftIntervalId;

    // Physics Methods
    applyGravity() {
        this.gravityIntervalId = setInterval(() => {
            // Check if game is paused
            if (this.world && this.world.isPaused) return;
            
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else if (this.y > 165) {
                // Falls Character unter dem Boden ist, zurück zum Boden setzen
                this.y = 165;
                this.speedY = 0;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        return this.y < 165;  // Boden-Level an Character-Position angepasst
    }

    // Image Loading Methods
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    // Animation Methods
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        if (this.imageCache[path]) {
            this.img = this.imageCache[path];
        }
        this.currentImage++;
    }

    // Movement Methods
    moveRight() {
        console.log('Moving right');
    }

    moveLeft() {
        this.moveLeftIntervalId = setInterval(() => {
            // Check if game is paused
            if (this.world && this.world.isPaused) return;
            
            this.x -= this.speed;
        }, 1000 / 60);
    }

    // Collision Detection
    isColliding(obj) {
        if (obj.isDead) return false;

        const myBox = this.getCollisionBox();
        const objBox = this.getObjectCollisionBox(obj);

        return this.checkBoxesOverlap(myBox, objBox);
    }

    getCollisionBox() {
        return {
            x: this.x + (this.collisionOffsetX || 0),
            y: this.y + (this.collisionOffsetY || 0),
            width: this.collisionWidth || this.width,
            height: this.collisionHeight || this.height
        };
    }

    getObjectCollisionBox(obj) {
        return {
            x: obj.x + (obj.collisionOffsetX || 0),
            y: obj.y + (obj.collisionOffsetY || 0),
            width: obj.collisionWidth || obj.width,
            height: obj.collisionHeight || obj.height
        };
    }

    checkBoxesOverlap(box1, box2) {
        return box1.x < box2.x + box2.width &&
               box1.x + box1.width > box2.x &&
               box1.y < box2.y + box2.height &&
               box1.y + box1.height > box2.y;
    }

    // Damage System
    takeDamage(damage) {
        if (this.isDead) return;

        this.applyDamage(damage);
        this.logDamage(damage);
        this.playHitAnimationIfAlive();
        this.checkIfDead();
    }

    applyDamage(damage) {
        this.currentHP -= damage;
        if (this.currentHP < 0) {
            this.currentHP = 0;
        }
    }

    logDamage(damage) {
        console.log(`${this.constructor.name} took ${damage} damage. HP: ${this.currentHP}/${this.maxHP}`);
    }

    playHitAnimationIfAlive() {
        if (this.playTakeHitAnimation && this.currentHP > 0) {
            this.playTakeHitAnimation();
        }
    }

    checkIfDead() {
        if (this.currentHP === 0) {
            this.die();
        }
    }

    die() {
        this.isDead = true;
        console.log(`${this.constructor.name} died!`);
        // Wird in Subklassen überschrieben für spezifische Tod-Animationen
        this.cleanup();
    }

    // Cleanup method to clear all intervals
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

    // Debug: Draw collision frame
    drawFrame(ctx) {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }
}