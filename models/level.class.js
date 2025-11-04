class Level {
    enemies;
    clouds;
    backgroundObjects;
    collectibles;
    level_end_x = 5100;
    level_start_x = 110;

    /**
     * Creates a new level with specified game objects and boundaries
     * @function constructor
     * @param {Array} enemies - Array of enemy objects
     * @param {Array} clouds - Array of cloud objects
     * @param {Array} backgroundObjects - Array of background objects
     * @param {Array} collectibles - Array of collectible objects
     * @returns {void}
     */
    constructor(enemies, clouds, backgroundObjects, collectibles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.collectibles = collectibles || [];
    }
}