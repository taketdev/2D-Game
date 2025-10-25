// Global Variables
let canvas;
let world;
let keyboard = new Keyboard();
let menu;

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
 * Preload fonts before initializing the game
 */
function preloadFonts() {
    return new Promise((resolve) => {
        // Create temporary canvas to force font loading
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // Try to use each font variant to ensure they're loaded
        const fonts = [
            '16px PixelifySans',
            'bold 16px PixelifySans',
            '500 16px PixelifySans',
            '600 16px PixelifySans'
        ];
        
        fonts.forEach(font => {
            tempCtx.font = font;
            tempCtx.fillText('Loading...', 0, 0);
        });
        
        // Give fonts time to load
        setTimeout(resolve, 100);
    });
}

/**
 * Initialize the menu (called on page load)
 */
async function init() {
    // Preload fonts first
    await preloadFonts();
    
    canvas = document.getElementById('canvas');
    menu = new Menu(canvas);

    // Start menu render loop
    startMenuLoop();
}

/**
 * Menu render loop
 */
function startMenuLoop() {
    function menuRender() {
        if (menu && menu.isActive) {
            menu.draw();
            requestAnimationFrame(menuRender);
        } else if (menu && menu.gameStarted) {
            // Menu closed, game started - do nothing, world loop handles rendering
        }
    }
    requestAnimationFrame(menuRender);
}

/**
 * Stop menu render loop
 */
function stopMenuLoop() {
    // The loop will stop automatically when menu.isActive becomes false
    // This function exists for consistency with startMenuLoop calls
}

/**
 * Initialize the actual game (called from menu when Play is clicked)
 */
function initGame() {
    world = new World(canvas, keyboard);

    // Initialize touch controls on mobile devices
    if (typeof isMobileDevice === 'function' && isMobileDevice()) {
        touchControls = new TouchControls(canvas, keyboard);
        console.log('Touch controls activated for mobile');
    }

    console.log('Game started! My Character is', world.character);
}

/**
 * Cleanup game when needed (e.g., on game over or restart)
 */
function cleanup() {
    if (world && world.cleanup) {
        world.cleanup();
        console.log('Game cleanup completed');
    }
    // Reset world to null so a completely new instance is created
    world = null;

    // Cleanup touch controls
    if (touchControls && touchControls.cleanup) {
        touchControls.cleanup();
        touchControls = null;
        console.log('Touch controls cleanup completed');
    }
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