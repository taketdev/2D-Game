class World {

    character = new Character();

    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken()
    ];

    clouds = [
        new Cloud(),
        new Cloud()
    ];

    backgroundObjects = [
        new BackgroundObject('./img_pollo_locco/img/5_background/layers/air.png', 0),
        new BackgroundObject('./img_pollo_locco/img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('./img_pollo_locco/img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('./img_pollo_locco/img/5_background/layers/1_first_layer/1.png', 0)
    ];

    canvas;
    ctx;

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.draw();
    }

    // Draw() wird immer wieder aufgerufen
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addObjectsToMap(this.backgroundObjects); // Alle Hintergründe werden hinzugefügt
        this.addToMap(this.character); // Alle Character werden hinzugefügt
        this.addObjectsToMap(this.clouds); // Alle Clouds werden hinzugefügt
        this.addObjectsToMap(this.enemies); // Alle Enemies werden hinzugefügt

        
        // Draw() wird immer wieder aufgerufen
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
        if (mo.img) {
            this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        }
    }
}