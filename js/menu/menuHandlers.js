/**
 * Menu Event Handlers
 * Contains all event handling and interaction methods for the menu system
 */

// Mouse Event Handlers
Menu.prototype.handleMouseDown = function(e) {
    if (!this.isActive || !this.imagesLoaded) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check which button was pressed
    Object.entries(this.buttonStates).forEach(([name, state]) => {
        if (state.bounds && this.isPointInButton(x, y, state.bounds)) {
            state.pressed = true;
        }
    });
};

Menu.prototype.handleMouseUp = function(e) {
    if (!this.isActive || !this.imagesLoaded) return;

    // Reset all pressed states
    Object.values(this.buttonStates).forEach(state => {
        state.pressed = false;
    });
};

Menu.prototype.handleMouseMove = function(e) {
    if (!this.imagesLoaded) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let overButton = false;

    // Check pause button when game is running
    if (!this.isActive && this.gameStarted && world && world.pauseButtonBounds) {
        if (this.isPointInButton(x, y, world.pauseButtonBounds)) {
            overButton = true;
        }
    }

    // Check if hovering over any menu button that has valid bounds
    if (this.isActive) {
        Object.entries(this.buttonStates).forEach(([name, state]) => {
            if (state.bounds && this.isPointInButton(x, y, state.bounds)) {
                overButton = true;
            }
        });
    }

    this.canvas.style.cursor = overButton ? 'pointer' : 'default';
};

// Click Event Handlers
Menu.prototype.handleClick = function(e) {
    if (!this.imagesLoaded) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (this.handlePauseButtonClick(x, y)) return;
    if (!this.isActive) return;
    if (this.handleDialogClick(x, y)) return;
    this.handleMainMenuClick(x, y);
};

Menu.prototype.handlePauseButtonClick = function(x, y) {
    if (!this.isActive && this.gameStarted && world && world.pauseButtonBounds) {
        if (this.isPointInButton(x, y, world.pauseButtonBounds)) {
            this.togglePause();
            return true;
        }
    }
    return false;
};

Menu.prototype.handleDialogClick = function(x, y) {
    if (this.currentDialog === 'settings') {
        this.handleSettingsClick(x, y);
        return true;
    }
    if (this.currentDialog === 'controls') {
        this.handleControlsClick(x, y);
        return true;
    }
    if (this.currentDialog === 'pause') {
        this.handlePauseClick(x, y);
        return true;
    }
    return false;
};

Menu.prototype.handleMainMenuClick = function(x, y) {
    if (this.checkPlayButtonClick(x, y)) return;
    if (this.checkSettingsButtonClick(x, y)) return;
    if (this.checkExitButtonClick(x, y)) return;
    if (this.checkQuestionButtonClick(x, y)) return;
};

Menu.prototype.checkPlayButtonClick = function(x, y) {
    const playBtn = this.buttonStates.play;
    if (playBtn.bounds && this.isPointInButton(x, y, playBtn.bounds)) {
        if (this.isGameOver || this.isVictory) {
            this.restartGame();
        } else {
            this.startGame();
        }
        return true;
    }
    return false;
};

Menu.prototype.checkSettingsButtonClick = function(x, y) {
    const settingsBtn = this.buttonStates.settings;
    if (settingsBtn.bounds && this.isPointInButton(x, y, settingsBtn.bounds)) {
        this.openSettings();
        return true;
    }
    return false;
};

Menu.prototype.checkExitButtonClick = function(x, y) {
    const exitBtn = this.buttonStates.exit;
    if (exitBtn.bounds && this.isPointInButton(x, y, exitBtn.bounds)) {
        if (this.isGameOver || this.isVictory) {
            this.returnToMainMenu();
        } else {
            this.exitGame();
        }
        return true;
    }
    return false;
};

Menu.prototype.checkQuestionButtonClick = function(x, y) {
    const questionBtn = this.buttonStates.question;
    if (questionBtn.bounds && this.isPointInButton(x, y, questionBtn.bounds)) {
        this.openControls();
        return true;
    }
    return false;
};

// Dialog Click Handlers
Menu.prototype.handleSettingsClick = function(x, y) {
    // Music toggle button
    const musicToggleBtn = this.buttonStates.musicToggle;
    if (musicToggleBtn.bounds && this.isPointInButton(x, y, musicToggleBtn.bounds)) {
        this.toggleMusic();
        return;
    }

    // Close button
    const closeBtn = this.buttonStates.close;
    if (closeBtn.bounds && this.isPointInButton(x, y, closeBtn.bounds)) {
        this.closeSettings();
        return;
    }
};

Menu.prototype.handleControlsClick = function(x, y) {
    // Close button
    const closeBtn = this.buttonStates.close;
    if (closeBtn.bounds && this.isPointInButton(x, y, closeBtn.bounds)) {
        this.closeControls();
        return;
    }
};

Menu.prototype.handlePauseClick = function(x, y) {
    // Resume button
    const resumeBtn = this.buttonStates.resume;
    if (resumeBtn.bounds && this.isPointInButton(x, y, resumeBtn.bounds)) {
        this.resumeGame();
        return;
    }

    // Settings button
    const settingsBtn = this.buttonStates.settings;
    if (settingsBtn.bounds && this.isPointInButton(x, y, settingsBtn.bounds)) {
        this.openSettingsFromPause();
        return;
    }

    // Exit to main menu button
    const exitBtn = this.buttonStates.exit;
    if (exitBtn.bounds && this.isPointInButton(x, y, exitBtn.bounds)) {
        this.exitToMainMenu();
        return;
    }
};

// Touch Event Handlers
Menu.prototype.handleTouchStart = function(e) {
    e.preventDefault();
    if (!this.imagesLoaded) return;

    const { scaleX, scaleY, rect } = this.getTouchScaleFactors();

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        this.processTouchStartPoint(touch, scaleX, scaleY, rect);
    }
};

Menu.prototype.getTouchScaleFactors = function() {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return { scaleX, scaleY, rect };
};

Menu.prototype.processTouchStartPoint = function(touch, scaleX, scaleY, rect) {
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;

    if (this.isActive) {
        this.checkButtonPress(x, y);
    }
};

Menu.prototype.checkButtonPress = function(x, y) {
    Object.entries(this.buttonStates).forEach(([name, state]) => {
        if (state.bounds && this.isPointInButton(x, y, state.bounds)) {
            state.pressed = true;
        }
    });
};

Menu.prototype.handleTouchEnd = function(e) {
    e.preventDefault();
    if (!this.imagesLoaded) return;

    const { scaleX, scaleY, rect } = this.getTouchScaleFactors();

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        this.processTouchEndPoint(touch, scaleX, scaleY, rect);
    }

    this.resetButtonPressedStates();
};

Menu.prototype.processTouchEndPoint = function(touch, scaleX, scaleY, rect) {
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;
    this.handleTouchClick(x, y);
};

Menu.prototype.resetButtonPressedStates = function() {
    if (this.isActive) {
        Object.values(this.buttonStates).forEach(state => {
            state.pressed = false;
        });
    }
};

Menu.prototype.handleTouchMove = function(e) {
    e.preventDefault();
    // Touch move doesn't need special handling for menus
};

Menu.prototype.handleTouchClick = function(x, y) {
    if (this.handleTouchPauseButtonClick(x, y)) return;
    if (!this.isActive) return;
    if (this.handleTouchDialogClick(x, y)) return;
    this.handleTouchMainMenuClick(x, y);
};

Menu.prototype.handleTouchPauseButtonClick = function(x, y) {
    if (!this.isActive && this.gameStarted && world && world.pauseButtonBounds) {
        if (this.isPointInButton(x, y, world.pauseButtonBounds)) {
            this.togglePause();
            return true;
        }
    }
    return false;
};

Menu.prototype.handleTouchDialogClick = function(x, y) {
    if (this.currentDialog === 'settings') {
        this.handleSettingsClick(x, y);
        return true;
    }
    if (this.currentDialog === 'controls') {
        this.handleControlsClick(x, y);
        return true;
    }
    if (this.currentDialog === 'pause') {
        this.handlePauseClick(x, y);
        return true;
    }
    return false;
};

Menu.prototype.handleTouchMainMenuClick = function(x, y) {
    if (this.checkPlayButtonClick(x, y)) return;
    if (this.checkSettingsButtonClick(x, y)) return;
    if (this.checkExitButtonClick(x, y)) return;
    if (this.checkQuestionButtonClick(x, y)) return;
};

// Helper Methods
Menu.prototype.isPointInButton = function(x, y, bounds) {
    return x >= bounds.x && x <= bounds.x + bounds.width &&
           y >= bounds.y && y <= bounds.y + bounds.height;
};
