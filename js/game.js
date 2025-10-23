// Global Variables
let canvas;
let world;
let keyboard = new Keyboard();

// Key Codes
const KEYS = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,
    SHIFT: 16,
    D: 68,      // Attack 1
    E: 69       // Attack 2
};

/**
 * Initialize the game
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    console.log('My Character is', world.character);
}

/**
 * Handle keydown events
 */
window.addEventListener('keydown', (event) => {
    switch(event.keyCode) {
        case KEYS.RIGHT:
            keyboard.RIGHT = true;
            break;
        case KEYS.LEFT:
            keyboard.LEFT = true;
            break;
        case KEYS.UP:
            keyboard.UP = true;
            break;
        case KEYS.DOWN:
            keyboard.DOWN = true;
            break;
        case KEYS.SPACE:
            keyboard.SPACE = true;
            break;
        case KEYS.SHIFT:
            keyboard.SHIFT = true;
            break;
        case KEYS.D:
            keyboard.D = true;
            break;
        case KEYS.E:
            keyboard.E = true;
            break;
    }
});

/**
 * Handle keyup events
 */
window.addEventListener('keyup', (event) => {
    switch(event.keyCode) {
        case KEYS.RIGHT:
            keyboard.RIGHT = false;
            break;
        case KEYS.LEFT:
            keyboard.LEFT = false;
            break;
        case KEYS.UP:
            keyboard.UP = false;
            break;
        case KEYS.DOWN:
            keyboard.DOWN = false;
            break;
        case KEYS.SPACE:
            keyboard.SPACE = false;
            break;
        case KEYS.SHIFT:
            keyboard.SHIFT = false;
            break;
        case KEYS.D:
            keyboard.D = false;
            break;
        case KEYS.E:
            keyboard.E = false;
            break;
    }
});