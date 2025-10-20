class MovableObject {
    x = 150;
    y = 350;
    img;
    height = 100;
    width = 100;
    speed = 0.15;
    imageCache = {};
    currentImage = 0;
    otherDirection = false;

    // loadImage('image/test.png');
    loadImage(path) {
        this.img = new Image(); // this.img = document.getElementById('image') <img id="image" src>
        this.img.src = path; 
    }

    loadImages(arr) {
        arr.forEach((path) => {

        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
    });
    }

    playAnimation(images) {
        let i = this.currentImage % this.IMAGES_WALKING.length;
        let path = images[i];
            if (this.imageCache[path]) {
                this.img = this.imageCache[path];
            }
        this.currentImage++;
    }

    moveRight() {
        console.log('Moving right');
    }

    moveLeft() {
        setInterval( () => {
        this.x -= this.speed;
        }, 1000 / 60);
    }
}