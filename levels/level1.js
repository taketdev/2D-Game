function createBackgroundObjects() {
    let backgroundObjects = [];
    addBattleground1Objects(backgroundObjects);
    addBattleground3Objects(backgroundObjects);
    addBattleground2Objects(backgroundObjects);
    return backgroundObjects;
}

function addBattleground1Objects(backgroundObjects) {
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
}

function addBattleground3Objects(backgroundObjects) {
    for (let i = 3; i < 5; i++) {
        let x = i * 720;
        backgroundObjects.push(
            new BackgroundObject(`./assets/background/Battleground3/Bright/sky.png`, x),
            new BackgroundObject(`./assets/background/Battleground3/Bright/grasses.png`, x),
            new BackgroundObject(`./assets/background/Battleground3/Bright/jungle_bg.png`, x),
            new BackgroundObject(`./assets/background/Battleground3/Bright/trees&bushes.png`, x),
            new BackgroundObject(`./assets/background/Battleground3/Bright/tree_face.png`, x),
            new BackgroundObject(`./assets/background/Battleground3/Bright/grass&road.png`, x)
        );
    }
}

function addBattleground2Objects(backgroundObjects) {
    for (let i = 5; i < 8; i++) {
        let x = i * 720;
        backgroundObjects.push(
            new BackgroundObject(`./assets/background/Battleground2/Bright/bg.png`, x),
            new BackgroundObject(`./assets/background/Battleground2/Bright/mountaims.png`, x),
            new BackgroundObject(`./assets/background/Battleground2/Bright/wall@windows.png`, x),
            new BackgroundObject(`./assets/background/Battleground2/Bright/dragon.png`, x),
            new BackgroundObject(`./assets/background/Battleground2/Bright/floor.png`, x)
        );
    }
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

// Funktion zum Erstellen von Wolken mit spezifischer Position
function createCloudAt(x, cloudType = 1) {
    let cloud = new Cloud();
    // Setze spezifische Position
    cloud.x = x;
    
    // Lade verschiedene Wolken-Bilder für Abwechslung
    const cloudImages = [
        './assets/clouds/Cloud1.png',
        './assets/clouds/Cloud2.png',
        './assets/clouds/Cloud3.png',
        './assets/clouds/Cloud4.png',
        './assets/clouds/Cloud5.png'
    ];
    
    cloud.loadImage(cloudImages[cloudType - 1] || cloudImages[0]);
    
    // Variiere Y-Position leicht für natürlicheres Aussehen
    cloud.y = 30 + Math.random() * 40; // Y zwischen 30 und 70
    
    return cloud;
}

function createLevel1() {
    return new Level(
        createEnemies(),
        createClouds(),
        createBackgroundObjects(),
        []
    );
}

function createEnemies() {
    return [
        createGoblinAt(500),
        createGoblinAt(1000),
        createGoblinAt(1800),
        createFlyingEyeAt(700),
        createFlyingEyeAt(1300),
        createFlyingEyeAt(1900),
        createMushroomAt(2400),
        createMushroomAt(3000),
        createSkeletonAt(2700),
        createSkeletonAt(3300),
    ];
}

function createClouds() {
    return [
        createCloudAt(400, 1),
        createCloudAt(900, 2),
        createCloudAt(1400, 3),
        createCloudAt(1800, 4),
        createCloudAt(650, 5),
        createCloudAt(1150, 1),
    ];
}

// Create initial level instance for compatibility
const level1 = createLevel1();