/**
 * Menu System for Return of the Wizard
 * Core menu class with initialization, state management and game flow control
 */

class Menu {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.initializeMenuState();
        this.initializeButtonStates();
        this.syncMusicSettings();
        this.loadImages();
        this.attachEventListeners();
        this.startMenuMusic();
    }

    /**
     * Initializes the menu state properties
     * @function initializeMenuState
     * @returns {void}
     */
    initializeMenuState() {
        this.isActive = true;
        this.currentDialog = null;
        this.previousDialog = null;
        this.gameStarted = false;
        this.isGameOver = false;
        this.isVictory = false;
        this.images = {};
        this.imagesLoaded = false;
    }

    /**
     * Initializes button state objects with default scale and pressed values
     * @function initializeButtonStates
     * @returns {void}
     */
    initializeButtonStates() {
        this.buttonStates = {
            play: { scale: 1, pressed: false },
            settings: { scale: 1, pressed: false },
            exit: { scale: 1, pressed: false },
            question: { scale: 1, pressed: false },
            close: { scale: 1, pressed: false },
            musicToggle: { scale: 1, pressed: false },
            resume: { scale: 1, pressed: false }
        };
    }

    /**
     * Synchronizes music settings with audio manager
     * @function syncMusicSettings
     * @returns {void}
     */
    syncMusicSettings() {
        if (typeof audioManager !== 'undefined' && audioManager) {
            this.musicEnabled = audioManager.musicEnabled;
        } else {
            this.musicEnabled = true;
        }
    }

    /**
     * Attaches event listeners for mouse and touch interactions
     * @function attachEventListeners
     * @returns {void}
     */
    attachEventListeners() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    }

    /**
     * Starts menu background music with a delay to ensure audio manager is loaded
     * @function startMenuMusic
     * @returns {void}
     */
    startMenuMusic() {
        setTimeout(() => {
            if (typeof audioManager !== 'undefined' && audioManager) {
                audioManager.playMenuMusic();
                console.log('Menu music started');
            }
        }, 500);
    }

    /**
     * Loads all menu images by getting paths and starting the loading process
     * @function loadImages
     * @returns {void}
     */
    loadImages() {
        const imagePaths = this.getImagePaths();
        this.loadImageSet(imagePaths);
    }

    /**
     * Returns object with all image paths for menu assets
     * @function getImagePaths
     * @returns {Object} Object containing all image file paths
     */
    getImagePaths() {
        return {
            background: './assets/menu/wallpapermenu.jpg',
            menuBlank: './assets/menu/menuBlank.png',
            playBtn: './assets/menu/playBtn.png',
            settingsBtn: './assets/menu/settingsBtn.png',
            exitBtn: './assets/menu/exitBtn.png',
            questionIcon: './assets/icons/questionIcon.png',
            menuBackground: './assets/menu/menuBackground.png',
            settingsMenu: './assets/menu/settingsMenu.png',
            xBtn: './assets/menu/xBtn.png',
            xBtnPressed: './assets/menu/xBtnPressed.png',
            musicIcon: './assets/icons/musicIcon.png',
            musicMuteIcon: './assets/icons/musicMuteIcon.png'
        };
    }

    /**
     * Loads a set of images and tracks loading progress
     * @function loadImageSet
     * @param {Object} imagePaths - Object with image keys and file paths
     * @returns {void}
     */
    loadImageSet(imagePaths) {
        let loadedCount = 0;
        const totalImages = Object.keys(imagePaths).length;

        Object.entries(imagePaths).forEach(([key, path]) => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    this.imagesLoaded = true;
                    console.log('All menu images loaded');
                }
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${path}`);
            };
            img.src = path;
            this.images[key] = img;
        });
    }

    /**
     * Main draw function that handles loading screen and active menu rendering
     * @function draw
     * @returns {void}
     */
    draw() {
        if (!this.imagesLoaded) {
            this.drawLoadingScreen();
            return;
        }

        if (!this.isActive) return;

        this.drawBackground();
        this.clearInactiveButtonBounds();
        this.drawCurrentMenu();
    }

    /**
     * Draws a simple loading screen while images are being loaded
     * @function drawLoadingScreen
     * @returns {void}
     */
    drawLoadingScreen() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px PixelifySans';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Loading...', this.canvas.width / 2, this.canvas.height / 2);
    }

    /**
     * Draws the background based on current menu state
     * @function drawBackground
     * @returns {void}
     */
    drawBackground() {
        if (this.isGameOver || this.isVictory) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.drawImage(this.images.background, 0, 0, this.canvas.width, this.canvas.height);
        }
    }

    /**
     * Draws the appropriate menu based on current dialog and game state
     * @function drawCurrentMenu
     * @returns {void}
     */
    drawCurrentMenu() {
        if (this.currentDialog === 'settings') {
            this.drawSettingsDialog();
        } else if (this.currentDialog === 'controls') {
            this.drawControlsDialog();
        } else if (this.currentDialog === 'pause') {
            this.drawPauseDialog();
        } else {
            if (this.isGameOver) {
                this.drawGameOverMenu();
            } else if (this.isVictory) {
                this.drawVictoryMenu();
            } else {
                this.drawMainMenu();
            }
        }
    }

    /**
     * Clears button bounds for buttons that are not currently visible
     * @function clearInactiveButtonBounds
     * @returns {void}
     */
    clearInactiveButtonBounds() {
        if (this.currentDialog === 'settings' || this.currentDialog === 'controls') {
            this.clearMainMenuBounds();
        } else if (this.currentDialog === 'pause') {
            this.clearPauseMenuBounds();
        } else {
            this.clearDialogBounds();
        }
    }

    /**
     * Clears bounds for main menu buttons
     * @function clearMainMenuBounds
     * @returns {void}
     */
    clearMainMenuBounds() {
        ['play', 'settings', 'exit', 'question'].forEach(name => {
            if (this.buttonStates[name]) {
                this.buttonStates[name].bounds = null;
            }
        });
    }

    /**
     * Clears bounds for pause menu buttons
     * @function clearPauseMenuBounds
     * @returns {void}
     */
    clearPauseMenuBounds() {
        ['play', 'settings', 'question'].forEach(name => {
            if (this.buttonStates[name]) {
                this.buttonStates[name].bounds = null;
            }
        });
    }

    /**
     * Clears bounds for dialog buttons
     * @function clearDialogBounds
     * @returns {void}
     */
    clearDialogBounds() {
        ['musicToggle', 'close', 'resume'].forEach(name => {
            if (this.buttonStates[name]) {
                this.buttonStates[name].bounds = null;
            }
        });
    }

}
