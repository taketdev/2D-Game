/**
 * Menu Actions
 * Contains all game flow control and dialog management methods
 */

/**
 * Starts the game by deactivating menu and initializing game world
 * @function startGame
 * @returns {void}
 */
Menu.prototype.startGame = function() {
    console.log('Starting game...');
    this.isActive = false;
    this.gameStarted = true;

    if (typeof initGame === 'function') {
        initGame();
    }
};

/**
 * Handles exit game functionality
 * @function exitGame
 * @returns {void}
 */
Menu.prototype.exitGame = function() {
    console.log('Exit button clicked');
};

/**
 * Restarts the game by cleaning up current instance and starting fresh
 * @function restartGame
 * @returns {void}
 */
Menu.prototype.restartGame = function() {
    console.log('Restarting game...');

    if (typeof cleanup === 'function') {
        cleanup();
    }

    this.isGameOver = false;
    this.isVictory = false;
    this.currentDialog = null;
    this.isActive = false;
    this.gameStarted = true;

    if (typeof initGame === 'function') {
        initGame();
    }
};

/**
 * Returns to main menu by cleaning up game and resetting menu state
 * @function returnToMainMenu
 * @returns {void}
 */
Menu.prototype.returnToMainMenu = function() {
    console.log('Returning to main menu...');

    if (typeof cleanup === 'function') {
        cleanup();
    }

    this.isGameOver = false;
    this.isVictory = false;
    this.currentDialog = null;
    this.isActive = true;
    this.gameStarted = false;
};

/**
 * Toggles game pause state between paused and resumed
 * @function togglePause
 * @returns {void}
 */
Menu.prototype.togglePause = function() {
    if (!world) return;

    if (world.isPaused) {
        this.resumeGame();
    } else {
        this.pauseGame();
    }
};

/**
 * Pauses the game and shows pause dialog
 * @function pauseGame
 * @returns {void}
 */
Menu.prototype.pauseGame = function() {
    console.log('Pausing game...');
    if (world) {
        world.isPaused = true;
    }
    this.isActive = true;
    this.currentDialog = 'pause';

    if (typeof startMenuLoop === 'function') {
        startMenuLoop();
    }
};

/**
 * Resumes the game and hides menu
 * @function resumeGame
 * @returns {void}
 */
Menu.prototype.resumeGame = function() {
    console.log('Resuming game...');
    if (world) {
        world.isPaused = false;
    }
    this.isActive = false;
    this.currentDialog = null;

    if (typeof stopMenuLoop === 'function') {
        stopMenuLoop();
    }
};

/**
 * Exits to main menu from pause state
 * @function exitToMainMenu
 * @returns {void}
 */
Menu.prototype.exitToMainMenu = function() {
    console.log('Exiting to main menu from pause...');

    if (typeof cleanup === 'function') {
        cleanup();
    }

    this.isGameOver = false;
    this.isVictory = false;
    this.currentDialog = null;
    this.isActive = true;
    this.gameStarted = false;
};

/**
 * Opens the settings dialog
 * @function openSettings
 * @returns {void}
 */
Menu.prototype.openSettings = function() {
    console.log('Opening settings...');
    this.previousDialog = null;
    this.currentDialog = 'settings';
};

/**
 * Closes the settings dialog and returns to previous state
 * @function closeSettings
 * @returns {void}
 */
Menu.prototype.closeSettings = function() {
    console.log('Closing settings...');
    if (this.previousDialog === 'pause') {
        this.currentDialog = 'pause';
        this.previousDialog = null;
    } else {
        this.currentDialog = null;
    }
};

/**
 * Opens settings dialog from pause menu
 * @function openSettingsFromPause
 * @returns {void}
 */
Menu.prototype.openSettingsFromPause = function() {
    console.log('Opening settings from pause...');
    this.previousDialog = 'pause';
    this.currentDialog = 'settings';
};

/**
 * Opens the controls dialog
 * @function openControls
 * @returns {void}
 */
Menu.prototype.openControls = function() {
    console.log('Opening controls...');
    this.currentDialog = 'controls';
};

/**
 * Closes the controls dialog
 * @function closeControls
 * @returns {void}
 */
Menu.prototype.closeControls = function() {
    console.log('Closing controls...');
    this.currentDialog = null;
};

/**
 * Toggles music on or off using audio manager
 * @function toggleMusic
 * @returns {void}
 */
Menu.prototype.toggleMusic = function() {
    if (typeof audioManager !== 'undefined' && audioManager) {
        this.musicEnabled = audioManager.toggleMusic();
    } else {
        this.musicEnabled = !this.musicEnabled;
    }

    console.log('Music toggled:', this.musicEnabled ? 'ON' : 'OFF');
};

/**
 * Shows game over screen and activates menu
 * @function showGameOver
 * @returns {void}
 */
Menu.prototype.showGameOver = function() {
    console.log('Game Over!');
    this.isActive = true;
    this.isGameOver = true;
    this.isVictory = false;
    this.currentDialog = null;
    this.gameStarted = false;

    this.startMenuMusic();

    if (typeof startMenuLoop === 'function') {
        startMenuLoop();
    }
};

/**
 * Shows victory screen and activates menu
 * @function showVictory
 * @returns {void}
 */
Menu.prototype.showVictory = function() {
    console.log('Victory!');
    this.isActive = true;
    this.isGameOver = false;
    this.isVictory = true;
    this.currentDialog = null;
    this.gameStarted = false;

    this.startMenuMusic();

    if (typeof startMenuLoop === 'function') {
        startMenuLoop();
    }
};
