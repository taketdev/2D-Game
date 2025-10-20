class MovableObject {
    x = 150;
    y = 350;
    img;
    height = 100;
    width = 100;
    // loadImage('image/test.png');
    loadImage(path) {
        this.img = new Image(); // this.img = document.getElementById('image') <img id="image" src>
        this.img.src = path; 
    }

    moveRight() {
        console.log('Moving right');
    }

    moveLeft() {
        console.log('Moving left');
    }
}