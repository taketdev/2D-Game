function createBackgroundObjects() {
    let backgroundObjects = [];

    // Battleground1: Erste Hälfte des Levels (3x wiederholt = 2160px)
    // Von x=0 bis x=2160 (kein negativer Bereich mehr)
    for (let i = 0; i < 3; i++) {
        let x = i * 720;

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

    // Battleground3: Mittlerer Teil des Levels (2x wiederholt = 1440px)
    // Startet nahtlos bei x=2160
    for (let i = 3; i < 5; i++) {
        let x = i * 720;

        backgroundObjects.push(
            new BackgroundObject(`./assets/background/Battleground3/Bright/sky.png`, x),
            new BackgroundObject(`./assets/background/Battleground3/Bright/grasses.png`, x),
            new BackgroundObject(`./assets/background/Battleground3/Bright/jungle_bg.png`, x),
            new BackgroundObject(`./assets/background/Battleground3/Bright/trees&bushes.png`, x),
            new BackgroundObject(`./assets/background/Battleground3/Bright/tree_face.png`, x),
            new BackgroundObject(`./assets/background/Battleground3/Bright/lianas.png`, x),
            new BackgroundObject(`./assets/background/Battleground3/Bright/grass&road.png`, x),
            new BackgroundObject(`./assets/background/Battleground3/Bright/fireflys.png`, x)
        );
    }

    // Battleground2: Letzter Teil des Levels (3x wiederholt = 2160px)
    // Startet nahtlos bei x=3600
    for (let i = 5; i < 8; i++) {
        let x = i * 720;

        backgroundObjects.push(
            new BackgroundObject(`./assets/background/Battleground2/Bright/bg.png`, x),
            new BackgroundObject(`./assets/background/Battleground2/Bright/mountaims.png`, x),
            new BackgroundObject(`./assets/background/Battleground2/Bright/wall@windows.png`, x),
            new BackgroundObject(`./assets/background/Battleground2/Bright/columns&falgs.png`, x),
            new BackgroundObject(`./assets/background/Battleground2/Bright/dragon.png`, x),
            new BackgroundObject(`./assets/background/Battleground2/Bright/candeliar.png`, x),
            new BackgroundObject(`./assets/background/Battleground2/Bright/floor.png`, x)
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