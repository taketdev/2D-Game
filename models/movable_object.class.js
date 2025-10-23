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

    // Physics Methods
    applyGravity() {
        setInterval(() => {
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
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }

    // Collision Detection
    isColliding(obj) {
        // Ignoriere Kollision mit toten Objekten
        if (obj.isDead) return false;

        // Verwende die Collision-Box Werte wenn vorhanden
        let myX = this.x + (this.collisionOffsetX || 0);
        let myY = this.y + (this.collisionOffsetY || 0);
        let myWidth = this.collisionWidth || this.width;
        let myHeight = this.collisionHeight || this.height;

        let objX = obj.x + (obj.collisionOffsetX || 0);
        let objY = obj.y + (obj.collisionOffsetY || 0);
        let objWidth = obj.collisionWidth || obj.width;
        let objHeight = obj.collisionHeight || obj.height;

        return myX < objX + objWidth &&
               myX + myWidth > objX &&
               myY < objY + objHeight &&
               myY + myHeight > objY;
    }

    // Damage System
    takeDamage(damage) {
        if (this.isDead) return;

        this.currentHP -= damage;

        // Verhindere negative HP
        if (this.currentHP < 0) {
            this.currentHP = 0;
        }

        // Debug-Ausgabe
        console.log(`${this.constructor.name} took ${damage} damage. HP: ${this.currentHP}/${this.maxHP}`);

        // Trigger Take Hit Animation (wenn verfügbar)
        if (this.playTakeHitAnimation && this.currentHP > 0) {
            this.playTakeHitAnimation();
        }

        // Prüfe ob tot
        if (this.currentHP === 0) {
            this.die();
        }
    }

    die() {
        this.isDead = true;
        console.log(`${this.constructor.name} died!`);
        // Wird in Subklassen überschrieben für spezifische Tod-Animationen
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