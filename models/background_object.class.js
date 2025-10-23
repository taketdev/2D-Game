class BackgroundObject extends MovableObject {

    width = 721; // Kleine Überlappung hinzugefügt um Lücken zu vermeiden
    height = 480;
    
    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);
        this.y = 480 - this.height; // 480 - 400 = 80
        this.x = Math.round(x); // Runde Position auf ganze Zahlen
    }
}