let canvas;
let world;
let keyboard = new Keyboard();
let menu;

const KEYS = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,
    SHIFT: 16,
    D: 68,
    E: 69
};

/**
 * Preloads fonts before initializing the game to ensure proper text rendering
 * @function preloadFonts
 * @returns {Promise} Promise that resolves when fonts are loaded
 */
function preloadFonts() {
    return new Promise((resolve) => {
        const tempCtx = createTempCanvas();
        const fonts = getFontVariants();
        loadFontsOnCanvas(tempCtx, fonts);
        waitForFontsToLoad(resolve);
    });
}

/**
 * Creates a temporary canvas context for font preloading
 * @function createTempCanvas
 * @returns {CanvasRenderingContext2D} Temporary canvas context
 */
function createTempCanvas() {
    const tempCanvas = document.createElement('canvas');
    return tempCanvas.getContext('2d');
}

/**
 * Returns array of font variants to preload
 * @function getFontVariants
 * @returns {string[]} Array of font variant strings
 */
function getFontVariants() {
    return [
        '16px PixelifySans',
        'bold 16px PixelifySans',
        '500 16px PixelifySans',
        '600 16px PixelifySans'
    ];
}

/**
 * Loads fonts on canvas context to trigger font loading
 * @function loadFontsOnCanvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context to load fonts on
 * @param {string[]} fonts - Array of font variant strings
 * @returns {void}
 */
function loadFontsOnCanvas(ctx, fonts) {
    fonts.forEach(font => {
        ctx.font = font;
        ctx.fillText('Loading...', 0, 0);
    });
}

/**
 * Waits for fonts to load with a short delay before resolving
 * @function waitForFontsToLoad
 * @param {Function} resolve - Promise resolve function
 * @returns {void}
 */
function waitForFontsToLoad(resolve) {
    setTimeout(resolve, 100);
}

/**
 * Initializes the menu system after preloading fonts and setting up canvas
 * @function init
 * @returns {Promise<void>}
 */
async function init() {
    await preloadFonts();
    
    canvas = document.getElementById('canvas');
    menu = new Menu(canvas);

    startMenuLoop();
}

/**
 * Starts the menu render loop that continues until game starts
 * @function startMenuLoop
 * @returns {void}
 */
function startMenuLoop() {
    function menuRender() {
        if (menu && menu.isActive) {
            menu.draw();
            requestAnimationFrame(menuRender);
        } else if (menu && menu.gameStarted) {
        }
    }
    requestAnimationFrame(menuRender);
}

/**
 * Stops the menu render loop automatically when menu becomes inactive
 * @function stopMenuLoop
 * @returns {void}
 */
function stopMenuLoop() {
}

/**
 * Initializes the actual game world, touch controls and game music
 * @function initGame
 * @returns {void}
 */
function initGame() {
    world = new World(canvas, keyboard);

    if (typeof isMobileDevice === 'function' && isMobileDevice()) {
        touchControls = new TouchControls(canvas, keyboard);
    }

    if (typeof audioManager !== 'undefined' && audioManager) {
        audioManager.playGameMusic();
    }
}

/**
 * Cleans up game resources including world and touch controls
 * @function cleanup
 * @returns {void}
 */
function cleanup() {
    if (world && world.cleanup) {
        world.cleanup();
    }
    world = null;

    if (touchControls && touchControls.cleanup) {
        touchControls.cleanup();
        touchControls = null;
    }
}

/**
 * Handles keydown events and updates keyboard state accordingly
 * @function keydown
 * @returns {void}
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
 * Handles keyup events and updates keyboard state accordingly
 * @function keyup
 * @returns {void}
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