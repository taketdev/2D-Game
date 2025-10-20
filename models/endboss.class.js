class Endboss extends MovableObject {

    y = 150;
    height = 300;
    width = 100;
    currentImage = 0;
    IMAGES_WALKING = [
        './img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G5.png',
        './img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G6.png',
        './img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G7.png',
        './img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G8.png',
        './img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G9.png',
        './img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G10.png',
        './img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G11.png',
        './img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    constructor(){
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 1900; // Endboss am Ende des Levels platziert (bei level_end_x = 2200)
        this.animate();
    }       

    animate() {
    setInterval(() => {
        this.playAnimation(this.IMAGES_WALKING);
    }, 200);
    }

}