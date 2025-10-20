class Character extends MovableObject{

    height = 280;
    y = 150;
    speed = 10;
    IMAGES_WALKING = [
            './img_pollo_locco/img/2_character_pepe/2_walk/W-21.png',
            './img_pollo_locco/img/2_character_pepe/2_walk/W-22.png',
            './img_pollo_locco/img/2_character_pepe/2_walk/W-23.png',
            './img_pollo_locco/img/2_character_pepe/2_walk/W-24.png',
            './img_pollo_locco/img/2_character_pepe/2_walk/W-25.png',
            './img_pollo_locco/img/2_character_pepe/2_walk/W-26.png'
        ];
    world;

    currentImage = 0;

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT && this.x > this.world.level.level_start_x) {
                this.x -= this.speed;
                this.otherDirection = true;
            }
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            // walk animation
            let i = this.currentImage % this.IMAGES_WALKING.length;
            let path = this.IMAGES_WALKING[i];
            if (this.imageCache[path]) {
                this.img = this.imageCache[path];
            }
            this.currentImage++;
        }
        }, 100);
    }

    moveRight(){

    }

    jump(){

    }
}