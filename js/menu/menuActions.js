/**
 * Menu Actions
 * Contains all game flow control and dialog management methods
 */

// Game Flow Control
Menu.prototype.startGame = function() {
    console.log('Starting game...');
    this.isActive = false;
    this.gameStarted = true;

    // Initialize the actual game
    if (typeof initGame === 'function') {
        initGame();
    }
};

Menu.prototype.exitGame = function() {
    console.log('Exit button clicked');
    // TODO: Implement exit functionality
};

Menu.prototype.restartGame = function() {
    console.log('Restarting game...');

    // Cleanup existing game
    if (typeof cleanup === 'function') {
        cleanup();
    }

    // Reset menu state
    this.isGameOver = false;
    this.isVictory = false;
    this.currentDialog = null;
    this.isActive = false;
    this.gameStarted = true;

    // Start new game
    if (typeof initGame === 'function') {
        initGame();
    }
};

Menu.prototype.returnToMainMenu = function() {
    console.log('Returning to main menu...');

    // Cleanup existing game
    if (typeof cleanup === 'function') {
        cleanup();
    }

    // Reset menu state
    this.isGameOver = false;
    this.isVictory = false;
    this.currentDialog = null;
    this.isActive = true;
    this.gameStarted = false;
};

// Pause Management
Menu.prototype.togglePause = function() {
    if (!world) return;

    if (world.isPaused) {
        this.resumeGame();
    } else {
        this.pauseGame();
    }
};

Menu.prototype.pauseGame = function() {
    console.log('Pausing game...');
    if (world) {
        world.isPaused = true;
    }
    this.isActive = true;
    this.currentDialog = 'pause';

    // Restart menu render loop
    if (typeof startMenuLoop === 'function') {
        startMenuLoop();
    }
};

Menu.prototype.resumeGame = function() {
    console.log('Resuming game...');
    if (world) {
        world.isPaused = false;
    }
    this.isActive = false;
    this.currentDialog = null;

    // Stop menu render loop
    if (typeof stopMenuLoop === 'function') {
        stopMenuLoop();
    }
};

Menu.prototype.exitToMainMenu = function() {
    console.log('Exiting to main menu from pause...');

    // Cleanup existing game
    if (typeof cleanup === 'function') {
        cleanup();
    }

    // Reset menu state
    this.isGameOver = false;
    this.isVictory = false;
    this.currentDialog = null;
    this.isActive = true;
    this.gameStarted = false;
};

// Dialog Management
Menu.prototype.openSettings = function() {
    console.log('Opening settings...');
    this.previousDialog = null;
    this.currentDialog = 'settings';
};

Menu.prototype.closeSettings = function() {
    console.log('Closing settings...');
    if (this.previousDialog === 'pause') {
        this.currentDialog = 'pause';
        this.previousDialog = null;
    } else {
        this.currentDialog = null;
    }
};

Menu.prototype.openSettingsFromPause = function() {
    console.log('Opening settings from pause...');
    this.previousDialog = 'pause';
    this.currentDialog = 'settings';
};

Menu.prototype.openControls = function() {
    console.log('Opening controls...');
    this.currentDialog = 'controls';
};

Menu.prototype.closeControls = function() {
    console.log('Closing controls...');
    this.currentDialog = null;
};

Menu.prototype.toggleMusic = function() {
    // Use Audio Manager if available
    if (typeof audioManager !== 'undefined' && audioManager) {
        this.musicEnabled = audioManager.toggleMusic();
    } else {
        this.musicEnabled = !this.musicEnabled;
    }

    console.log('Music toggled:', this.musicEnabled ? 'ON' : 'OFF');
};

// Game State Management
Menu.prototype.showGameOver = function() {
    console.log('Game Over!');
    this.isActive = true;
    this.isGameOver = true;
    this.isVictory = false;
    this.currentDialog = null;
    this.gameStarted = false;

    // Start menu music again
    this.startMenuMusic();

    // Restart menu render loop
    if (typeof startMenuLoop === 'function') {
        startMenuLoop();
    }
};

Menu.prototype.showVictory = function() {
    console.log('Victory!');
    this.isActive = true;
    this.isGameOver = false;
    this.isVictory = true;
    this.currentDialog = null;
    this.gameStarted = false;

    // Start menu music again
    this.startMenuMusic();

    // Restart menu render loop
    if (typeof startMenuLoop === 'function') {
        startMenuLoop();
    }
};
