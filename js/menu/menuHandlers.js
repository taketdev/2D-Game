/**
 * Menu Event Handlers
 * Contains all event handling and interaction methods for the menu system
 */

/**
 * Handles mouse down events and sets button pressed states
 * @function handleMouseDown
 * @param {MouseEvent} e - Mouse event object
 * @returns {void}
 */
Menu.prototype.handleMouseDown = function(e) {
    if (!this.isActive || !this.imagesLoaded) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    Object.entries(this.buttonStates).forEach(([name, state]) => {
        if (state.bounds && this.isPointInButton(x, y, state.bounds)) {
            state.pressed = true;
        }
    });
};

/**
 * Handles mouse up events and resets button pressed states
 * @function handleMouseUp
 * @param {MouseEvent} e - Mouse event object
 * @returns {void}
 */
Menu.prototype.handleMouseUp = function(e) {
    if (!this.isActive || !this.imagesLoaded) return;

    Object.values(this.buttonStates).forEach(state => {
        state.pressed = false;
    });
};

/**
 * Handles mouse move events and updates cursor style based on button hover
 * @function handleMouseMove
 * @param {MouseEvent} e - Mouse event object
 * @returns {void}
 */
Menu.prototype.handleMouseMove = function(e) {
    if (!this.imagesLoaded) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let overButton = false;

    if (!this.isActive && this.gameStarted && world && world.pauseButtonBounds) {
        if (this.isPointInButton(x, y, world.pauseButtonBounds)) {
            overButton = true;
        }
    }

    if (this.isActive) {
        Object.entries(this.buttonStates).forEach(([name, state]) => {
            if (state.bounds && this.isPointInButton(x, y, state.bounds)) {
                overButton = true;
            }
        });
    }

    this.canvas.style.cursor = overButton ? 'pointer' : 'default';
};

/**
 * Main click handler that delegates to appropriate sub-handlers
 * @function handleClick
 * @param {MouseEvent} e - Mouse event object
 * @returns {void}
 */
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

/**
 * Handles clicks on settings dialog elements
 * @function handleSettingsClick
 * @param {number} x - Click X coordinate
 * @param {number} y - Click Y coordinate
 * @returns {void}
 */
Menu.prototype.handleSettingsClick = function(x, y) {
    const musicToggleBtn = this.buttonStates.musicToggle;
    if (musicToggleBtn.bounds && this.isPointInButton(x, y, musicToggleBtn.bounds)) {
        this.toggleMusic();
        return;
    }

    const closeBtn = this.buttonStates.close;
    if (closeBtn.bounds && this.isPointInButton(x, y, closeBtn.bounds)) {
        this.closeSettings();
        return;
    }
};

/**
 * Handles clicks on controls dialog elements
 * @function handleControlsClick
 * @param {number} x - Click X coordinate
 * @param {number} y - Click Y coordinate
 * @returns {void}
 */
Menu.prototype.handleControlsClick = function(x, y) {
    const closeBtn = this.buttonStates.close;
    if (closeBtn.bounds && this.isPointInButton(x, y, closeBtn.bounds)) {
        this.closeControls();
        return;
    }
};

/**
 * Handles clicks on pause dialog elements
 * @function handlePauseClick
 * @param {number} x - Click X coordinate
 * @param {number} y - Click Y coordinate
 * @returns {void}
 */
Menu.prototype.handlePauseClick = function(x, y) {
    const resumeBtn = this.buttonStates.resume;
    if (resumeBtn.bounds && this.isPointInButton(x, y, resumeBtn.bounds)) {
        this.resumeGame();
        return;
    }

    const settingsBtn = this.buttonStates.settings;
    if (settingsBtn.bounds && this.isPointInButton(x, y, settingsBtn.bounds)) {
        this.openSettingsFromPause();
        return;
    }

    const exitBtn = this.buttonStates.exit;
    if (exitBtn.bounds && this.isPointInButton(x, y, exitBtn.bounds)) {
        this.exitToMainMenu();
        return;
    }
};

/**
 * Handles touch start events and processes touch points
 * @function handleTouchStart
 * @param {TouchEvent} e - Touch event object
 * @returns {void}
 */
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

/**
 * Handles touch move events with simple prevention
 * @function handleTouchMove
 * @param {TouchEvent} e - Touch event object
 * @returns {void}
 */
Menu.prototype.handleTouchMove = function(e) {
    e.preventDefault();
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

/**
 * Checks if a point is within button boundaries
 * @function isPointInButton
 * @param {number} x - Point X coordinate
 * @param {number} y - Point Y coordinate
 * @param {Object} bounds - Button bounds object with x, y, width, height
 * @returns {boolean} True if point is inside button bounds
 */
Menu.prototype.isPointInButton = function(x, y, bounds) {
    return x >= bounds.x && x <= bounds.x + bounds.width &&
           y >= bounds.y && y <= bounds.y + bounds.height;
};
