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
            } else if (this.y > 225) {
                // Falls Character unter dem Boden ist, zurück zum Boden setzen
                this.y = 225;
                this.speedY = 0;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        return this.y < 225;  // Boden-Level an Character-Position angepasst
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

    // Debug: Draw collision frame
    drawFrame(ctx) {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }
}