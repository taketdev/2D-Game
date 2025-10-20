class World {

    character = new Character();

    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x  = -100;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
    }

    setWorld(){
        this.character.world = this;
    }

    // Draw() wird immer wieder aufgerufen
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects); // Alle Hintergründe werden hinzugefügt
        this.addToMap(this.character); // Alle Character werden hinzugefügt
        this.addObjectsToMap(this.level.clouds); // Alle Clouds werden hinzugefügt
        this.addObjectsToMap(this.level.enemies); // Alle Enemies werden hinzugefügt

        this.ctx.translate(-this.camera_x, 0);
        
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
        if(mo.otherDirection) {
            this.ctx.save();
            this.ctx.translate(mo.x + mo.width, mo.y);
            this.ctx.scale(-1, 1);
            if (mo.img) {
                this.ctx.drawImage(mo.img, 0, 0, mo.width, mo.height);
            }
            this.ctx.restore();
        } else {
            if (mo.img) {
                this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
            }
        }
    }
}