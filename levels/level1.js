function createBackgroundObjects() {
    let backgroundObjects = [];
    
    // Erstelle Hintergrund für 2500px (ca. 4 Bildschirmbreiten von 720px)
    for (let i = -1; i < 4; i++) {
        let x = i * 720;
        
        // Wechsle zwischen Bild 1 und 2 für Abwechslung
        let imageNumber = (i % 2 === 0) ? '1' : '2';
        
        backgroundObjects.push(
            new BackgroundObject(`./assets/background/Battleground1/Bright/sky.png`, x),           
            new BackgroundObject(`./assets/background/Battleground1/Bright/ruins_bg.png`, x),
            new BackgroundObject('./assets/background/Battleground1/Bright/hills&trees.png', x),
            new BackgroundObject(`./assets/background/Battleground1/Bright/ruins.png`, x),
            new BackgroundObject(`./assets/background/Battleground1/Bright/ruins2.png`, x),
            new BackgroundObject(`./assets/background/Battleground1/Bright/statue.png`, x),
            new BackgroundObject(`./assets/background/Battleground1/Bright/stones&grass.png`, x)
            
        );
    }
    
    return backgroundObjects;
}

const level1 = new Level(
    [
        new Goblin(),
        new Goblin(),
        new Goblin(),
        new FlyingEye(),
        new FlyingEye(),
        new Endboss(),
    ],
    [
        new Cloud(),
        new Cloud(),
    ],
    createBackgroundObjects(),
    [] // Collectibles werden dynamisch gespawnt
);