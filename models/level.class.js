class Level {
    enemies;
    clouds;
    backgroundObjects;
    collectibles;
    level_end_x = 5000; // Level endet bei x=5200 (kurz nach Battleground2)
    level_start_x = 102; // Startbereich bei x=100 (unsichtbare Wand weiter rechts)

    constructor(enemies, clouds, backgroundObjects, collectibles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.collectibles = collectibles || [];
    }
}