class Character extends MovableObject {
    // Character Properties
    height = 280;
    y = 80;
    speed = 10;
    world;
    currentImage = 0;

    // Walking Animation Images
    IMAGES_WALKING = [
        './img_pollo_locco/img/2_character_pepe/2_walk/W-21.png',
        './img_pollo_locco/img/2_character_pepe/2_walk/W-22.png',
        './img_pollo_locco/img/2_character_pepe/2_walk/W-23.png',
        './img_pollo_locco/img/2_character_pepe/2_walk/W-24.png',
        './img_pollo_locco/img/2_character_pepe/2_walk/W-25.png',
        './img_pollo_locco/img/2_character_pepe/2_walk/W-26.png'
    ];

    // Jumping Animation Images
    IMAGES_JUMPING = [
        './img_pollo_locco/img/2_character_pepe/3_jump/J-31.png',
        './img_pollo_locco/img/2_character_pepe/3_jump/J-32.png',
        './img_pollo_locco/img/2_character_pepe/3_jump/J-33.png',
        './img_pollo_locco/img/2_character_pepe/3_jump/J-34.png',
        './img_pollo_locco/img/2_character_pepe/3_jump/J-35.png',
        './img_pollo_locco/img/2_character_pepe/3_jump/J-36.png',
        './img_pollo_locco/img/2_character_pepe/3_jump/J-37.png',
        './img_pollo_locco/img/2_character_pepe/3_jump/J-38.png',
        './img_pollo_locco/img/2_character_pepe/3_jump/J-39.png'
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        
        this.animate();
        this.applyGravity();
    }

    animate() {
        // Movement and controls (60 FPS)
        setInterval(() => {
            this.handleMovement();
            this.updateCamera();
        }, 1000 / 60);

        // Animation updates (10 FPS)
        setInterval(() => {
            this.handleAnimations();
        }, 100);
    }

    handleMovement() {
        if (!this.world) return;

        // Move right
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.x += this.speed;
            this.otherDirection = false;
        }

        // Move left  
        if (this.world.keyboard.LEFT && this.x > this.world.level.level_start_x) {
            this.x -= this.speed;
            this.otherDirection = true;
        }

        // Jump (Space or Up arrow)
        if (this.world.keyboard.SPACE || this.world.keyboard.UP) {
            this.jump();
        }
    }

    handleAnimations() {
        if (this.isAboveGround()) {
            // Jump animation when in the air
            this.playAnimation(this.IMAGES_JUMPING);
        } else {
            // Walk animation only when moving on ground
            if (this.world && this.world.keyboard && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }
    }

    updateCamera() {
        if (this.world) {
            this.world.camera_x = -this.x + 100;
        }
    }

    jump() {
        if (!this.isAboveGround()) { 
            this.speedY = 15; // Jump force upward
        }
    }
}