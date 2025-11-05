/**
 * Creates background objects for all battlegrounds and returns them as an array
 * @function createBackgroundObjects
 * @returns {Array} Array of background objects for the level
 */
function createBackgroundObjects() {
    let backgroundObjects = [];
    addBattleground1Objects(backgroundObjects);
    addBattleground3Objects(backgroundObjects);
    addBattleground2Objects(backgroundObjects);
    return backgroundObjects;
}

/**
 * Adds battleground 1 background objects to the provided array
 * @function addBattleground1Objects
 * @param {Array} backgroundObjects - Array to add background objects to
 * @returns {void}
 */
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

/**
 * Adds battleground 3 background objects to the provided array
 * @function addBattleground3Objects
 * @param {Array} backgroundObjects - Array to add background objects to
 * @returns {void}
 */
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

/**
 * Adds battleground 2 background objects to the provided array
 * @function addBattleground2Objects
 * @param {Array} backgroundObjects - Array to add background objects to
 * @returns {void}
 */
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

/**
 * Creates a new Goblin enemy at the specified position
 * @function createGoblinAt
 * @param {number} x - The x-coordinate position for the goblin
 * @returns {Goblin} A new Goblin instance with patrol boundaries set
 */
function createGoblinAt(x) {
    let goblin = new Goblin();
    goblin.x = x;
    goblin.patrolStartX = x;
    goblin.patrolEndX = x + goblin.patrolRange;
    return goblin;
}

/**
 * Creates a new Flying Eye enemy at the specified position
 * @function createFlyingEyeAt
 * @param {number} x - The x-coordinate position for the flying eye
 * @returns {FlyingEye} A new FlyingEye instance with starting Y position set
 */
function createFlyingEyeAt(x) {
    let flyingEye = new FlyingEye();
    flyingEye.x = x;
    flyingEye.startY = flyingEye.y;
    return flyingEye;
}

/**
 * Creates a new Mushroom enemy at the specified position
 * @function createMushroomAt
 * @param {number} x - The x-coordinate position for the mushroom
 * @returns {Mushroom} A new Mushroom instance with patrol boundaries set
 */
function createMushroomAt(x) {
    let mushroom = new Mushroom();
    mushroom.x = x;
    mushroom.patrolStartX = x;
    mushroom.patrolEndX = x + mushroom.patrolRange;
    return mushroom;
}

/**
 * Creates a new Skeleton enemy at the specified position
 * @function createSkeletonAt
 * @param {number} x - The x-coordinate position for the skeleton
 * @returns {Skeleton} A new Skeleton instance with patrol boundaries set
 */
function createSkeletonAt(x) {
    let skeleton = new Skeleton();
    skeleton.x = x;
    skeleton.patrolStartX = x;
    skeleton.patrolEndX = x + skeleton.patrolRange;
    return skeleton;
}

/**
 * Array of available cloud image paths
 * @constant {string[]}
 */
const CLOUD_IMAGES = [
    './assets/clouds/Cloud1.png',
    './assets/clouds/Cloud2.png',
    './assets/clouds/Cloud3.png',
    './assets/clouds/Cloud4.png',
    './assets/clouds/Cloud5.png'
];

/**
 * Creates a new Cloud object at the specified position with customizable appearance
 * @function createCloudAt
 * @param {number} x - The x-coordinate position for the cloud
 * @param {number} cloudType - The cloud type/image variant (1-5, defaults to 1)
 * @returns {Cloud} A new Cloud instance with position and image set
 */
function createCloudAt(x, cloudType = 1) {
    let cloud = new Cloud();
    cloud.x = x;
    cloud.loadImage(CLOUD_IMAGES[cloudType - 1] || CLOUD_IMAGES[0]);
    cloud.y = 30 + Math.random() * 40;
    return cloud;
}

/**
 * Creates and returns a complete Level 1 instance with all game objects
 * @function createLevel1
 * @returns {Level} A new Level instance with enemies, clouds, background objects and collectibles
 */
function createLevel1() {
    return new Level(
        createEnemies(),
        createClouds(),
        createBackgroundObjects(),
        []
    );
}

/**
 * Creates all enemy objects for Level 1 with specific positions
 * @function createEnemies
 * @returns {Array} Array of enemy objects including goblins, flying eyes, mushrooms and skeletons
 */
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

/**
 * Creates all cloud objects for Level 1 with varied positions and types
 * @function createClouds
 * @returns {Array} Array of cloud objects with different images and positions
 */
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

/**
 * Initial level instance created for compatibility with existing code
 */
const level1 = createLevel1();