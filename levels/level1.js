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
            if (i === 4) x -= 5;

        backgroundObjects.push(
            new BackgroundObject(`./assets/background/Battleground3/Bright/sky.png`, x),
            new BackgroundObject(`./assets/background/Battleground3/Bright/grasses.png`, x),
            new BackgroundObject(`./assets/background/Battleground3/Bright/jungle_bg.png`, x),
            new BackgroundObject(`./assets/background/Battleground3/Bright/trees&bushes.png`, x),
            new BackgroundObject(`./assets/background/Battleground3/Bright/tree_face.png`, x),
            new BackgroundObject(`./assets/background/Battleground3/Bright/grass&road.png`, x)
        );
    }

    // Battleground2: Letzter Teil des Levels (3x wiederholt = 2160px)
    // Startet nahtlos bei x=3600
    for (let i = 5; i < 8; i++) {
        let x = i * 720;
            if (i === 6) x -= 5;
            if (i === 7) x -= 10;

        backgroundObjects.push(
            new BackgroundObject(`./assets/background/Battleground2/Bright/bg.png`, x),
            new BackgroundObject(`./assets/background/Battleground2/Bright/mountaims.png`, x),
            new BackgroundObject(`./assets/background/Battleground2/Bright/wall@windows.png`, x),
            new BackgroundObject(`./assets/background/Battleground2/Bright/dragon.png`, x),
            new BackgroundObject(`./assets/background/Battleground2/Bright/floor.png`, x)
        );
    }

    return backgroundObjects;
}

// Funktion zum Erstellen von Goblins mit spezifischer Position
function createGoblinAt(x) {
    let goblin = new Goblin();
    goblin.x = x;
    goblin.patrolStartX = x;
    goblin.patrolEndX = x + goblin.patrolRange;
    return goblin;
}

// Funktion zum Erstellen von Flying Eyes mit spezifischer Position
function createFlyingEyeAt(x) {
    let flyingEye = new FlyingEye();
    flyingEye.x = x;
    flyingEye.startY = flyingEye.y;
    return flyingEye;
}

// Funktion zum Erstellen von Mushrooms mit spezifischer Position
function createMushroomAt(x) {
    let mushroom = new Mushroom();
    mushroom.x = x;
    mushroom.patrolStartX = x;
    mushroom.patrolEndX = x + mushroom.patrolRange;
    return mushroom;
}

// Funktion zum Erstellen von Skeletons mit spezifischer Position
function createSkeletonAt(x) {
    let skeleton = new Skeleton();
    skeleton.x = x;
    skeleton.patrolStartX = x;
    skeleton.patrolEndX = x + skeleton.patrolRange;
    return skeleton;
}

// Function to create a fresh level instance
function createLevel1() {
    return new Level(
        [
            // Battleground1 (x=0 bis x=2160): Goblins und Flying Eyes verteilt
            createGoblinAt(500),
            createGoblinAt(1000),
            createGoblinAt(1800),
            createFlyingEyeAt(700),
            createFlyingEyeAt(1300),
            createFlyingEyeAt(1900),

            // Battleground3 (x=2160 bis x=3600): Mushrooms und Skeletons verteilt
            createMushroomAt(2400),
            createMushroomAt(3000),
            createSkeletonAt(2700),
            createSkeletonAt(3300),

            // Endboss wird dynamisch gespawnt wenn Character Battleground2 erreicht
        ],
        [
            new Cloud(),
            new Cloud(),
        ],
        createBackgroundObjects(),
        [] // Collectibles werden dynamisch gespawnt
    );
}

// Create initial level instance for compatibility
const level1 = createLevel1();