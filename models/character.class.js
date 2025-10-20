class Character extends MovableObject{

    height = 280;
    y = 80;
    speed = 10;
    IMAGES_WALKING = [
            './img_pollo_locco/img/2_character_pepe/2_walk/W-21.png',
            './img_pollo_locco/img/2_character_pepe/2_walk/W-22.png',
            './img_pollo_locco/img/2_character_pepe/2_walk/W-23.png',
            './img_pollo_locco/img/2_character_pepe/2_walk/W-24.png',
            './img_pollo_locco/img/2_character_pepe/2_walk/W-25.png',
            './img_pollo_locco/img/2_character_pepe/2_walk/W-26.png'
        ];

    IMAGES_JUMPING = [
        './img_pollo_locco/img/2_character_pepe/3_jump/J-31.png',
        './img_pollo_locco/img/2_character_pepe/3_jump/J-32.png',
        './img_pollo_locco/img/2_character_pepe/3_jump/J-33.png',
        './img_pollo_locco/img/2_character_pepe/3_jump/J-34.png',
        './img_pollo_locco/img/2_character_pepe/3_jump/J-35.png',
        './img_pollo_locco/img/2_character_pepe/3_jump/J-36.png',
        './img_pollo_locco/img/2_character_pepe/3_jump/J-37.png',
        './img_pollo_locco/img/2_character_pepe/3_jump/J-38.png',
        './img_pollo_locco/img/2_character_pepe/3_jump/J-39.png',
    ];
    world;
    currentImage = 0;

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        
        this.animate();
        this.applyGravity();
    }

    animate() {
        setInterval(() => {
            if (this.world && this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.otherDirection = false;
            }
            if (this.world && this.world.keyboard.LEFT && this.x > this.world.level.level_start_x) {
                this.x -= this.speed;
                this.otherDirection = true;
            }
            if (this.world && (this.world.keyboard.SPACE || this.world.keyboard.UP)) {
                this.jump();
            }
            if (this.world) {
                this.world.camera_x = -this.x + 100;
            }
        }, 1000 / 60);

        setInterval(() => {
            if(this.isAboveGround()) {
                // Jump animation when in the air
                this.playAnimation(this.IMAGES_JUMPING);
            } else {
                // Walk animation only when moving on ground
                if (this.world && this.world.keyboard && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 100);
    }

    moveRight(){

    }

    jump(){
        if (!this.isAboveGround()) { // Nur springen wenn am Boden
            this.speedY = 15; // Sprungkraft nach oben
        }
    }
}