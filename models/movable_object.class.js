class MovableObject {
    // Position Properties
    x = 150;
    y = 350;
    
    // Size Properties  
    height = 100;
    width = 100;
    
    // Movement Properties
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
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        return this.y < 180;
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
}