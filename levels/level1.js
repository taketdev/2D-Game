function createBackgroundObjects() {
    let backgroundObjects = [];
    
    // Erstelle Hintergrund für 2500px (ca. 4 Bildschirmbreiten von 720px)
    for (let i = -1; i < 4; i++) {
        let x = i * 720;
        
        // Wechsle zwischen Bild 1 und 2 für Abwechslung
        let imageNumber = (i % 2 === 0) ? '1' : '2';
        
        backgroundObjects.push(
            new BackgroundObject('./img_pollo_locco/img/5_background/layers/air.png', x),
            new BackgroundObject(`./img_pollo_locco/img/5_background/layers/3_third_layer/${imageNumber}.png`, x),
            new BackgroundObject(`./img_pollo_locco/img/5_background/layers/2_second_layer/${imageNumber}.png`, x),
            new BackgroundObject(`./img_pollo_locco/img/5_background/layers/1_first_layer/${imageNumber}.png`, x)
        );
    }
    
    return backgroundObjects;
}

const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
    ],
    [
        new Cloud(),
        new Cloud(),
    ],
    createBackgroundObjects()
);