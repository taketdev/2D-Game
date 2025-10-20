class Level {
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 2200; // Level endet kurz vor dem letzten Hintergrundbild
    level_start_x = -500; // Startbereich links erweitert

    constructor(enemies, clouds, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }
}