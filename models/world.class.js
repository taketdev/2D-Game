class World {
    // Game Objects
    character = new Character();
    level = level1;
    
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
    }

    setWorld() {
        this.character.world = this;
    }

    // Main game loop - called continuously
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Apply camera transformation
        this.ctx.translate(this.camera_x, 0);

        // Draw all game objects in correct order
        this.addObjectsToMap(this.level.backgroundObjects);
        
        // Character (verschiedene Animationen)
        if (this.character.isAboveGround()) {
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

        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);

        // Draw collision frames for all enemies
        this.drawCollisionFrames();

        // Reset camera transformation
        this.ctx.translate(-this.camera_x, 0);
        
        // Continue game loop
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        // Check if object is Endboss with sprite animations
        if (mo instanceof Endboss) {
            if (mo.isWalking) {
                mo.drawWalkSprite(this.ctx);
            } else {
                mo.drawIdleSprite(this.ctx);
            }
        }
        // Check if object is Goblin with sprite animations
        else if (mo instanceof Goblin) {
            if (mo.isRunning) {
                mo.drawRunSprite(this.ctx);
            } else {
                mo.drawIdleSprite(this.ctx);
            }
        }
        // Check if object is Flying Eye with sprite animations
        else if (mo instanceof FlyingEye) {
            mo.drawFlightSprite(this.ctx);
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