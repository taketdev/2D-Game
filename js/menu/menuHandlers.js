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

/**
 * Checks and handles a click on the global pause button (outside the menu)
 * @function handlePauseButtonClick
 * @param {number} x - Click X coordinate
 * @param {number} y - Click Y coordinate
 * @returns {boolean} True if pause button was clicked and handled, false otherwise
 */
Menu.prototype.handlePauseButtonClick = function(x, y) {
    if (!this.isActive && this.gameStarted && world && world.pauseButtonBounds) {
        if (this.isPointInButton(x, y, world.pauseButtonBounds)) {
            this.togglePause();
            return true;
        }
    }
    return false;
};

/**
 * Delegates click handling to the currently open dialog (settings/controls/pause)
 * @function handleDialogClick
 * @param {number} x - Click X coordinate
 * @param {number} y - Click Y coordinate
 * @returns {boolean} True if a dialog handled the click, false otherwise
 */
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

/**
 * Handles clicks on main menu buttons (play, settings, exit, help)
 * @function handleMainMenuClick
 * @param {number} x - Click X coordinate
 * @param {number} y - Click Y coordinate
 * @returns {void}
 */
Menu.prototype.handleMainMenuClick = function(x, y) {
    if (this.checkPlayButtonClick(x, y)) return;
    if (this.checkSettingsButtonClick(x, y)) return;
    if (this.checkExitButtonClick(x, y)) return;
    if (this.checkQuestionButtonClick(x, y)) return;
};

/**
 * Checks whether the Play button was clicked and triggers the appropriate action
 * @function checkPlayButtonClick
 * @param {number} x - Click X coordinate
 * @param {number} y - Click Y coordinate
 * @returns {boolean} True if the play button handled the click, false otherwise
 */
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

/**
 * Checks whether the Settings button was clicked and opens the settings dialog
 * @function checkSettingsButtonClick
 * @param {number} x - Click X coordinate
 * @param {number} y - Click Y coordinate
 * @returns {boolean} True if the settings button handled the click, false otherwise
 */
Menu.prototype.checkSettingsButtonClick = function(x, y) {
    const settingsBtn = this.buttonStates.settings;
    if (settingsBtn.bounds && this.isPointInButton(x, y, settingsBtn.bounds)) {
        this.openSettings();
        return true;
    }
    return false;
};

/**
 * Checks whether the Exit button was clicked and triggers exit/return behavior
 * @function checkExitButtonClick
 * @param {number} x - Click X coordinate
 * @param {number} y - Click Y coordinate
 * @returns {boolean} True if the exit button handled the click, false otherwise
 */
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

/**
 * Checks whether the Question/Help button was clicked and opens controls/help
 * @function checkQuestionButtonClick
 * @param {number} x - Click X coordinate
 * @param {number} y - Click Y coordinate
 * @returns {boolean} True if the question/help button handled the click, false otherwise
 */
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

/**
 * Calculate scale factors between canvas display size and its drawing buffer
 * Useful to convert client/touch coordinates to canvas coordinate space
 * @function getTouchScaleFactors
 * @returns {{scaleX:number, scaleY:number, rect:DOMRect}} scale factors and bounding rect
 */
Menu.prototype.getTouchScaleFactors = function() {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return { scaleX, scaleY, rect };
};

/**
 * Process an individual touchstart point and update button pressed states
 * @function processTouchStartPoint
 * @param {Touch} touch - The touch object from the event
 * @param {number} scaleX - Horizontal canvas scale factor
 * @param {number} scaleY - Vertical canvas scale factor
 * @param {DOMRect} rect - Canvas bounding rect used for coordinate conversion
 * @returns {void}
 */
Menu.prototype.processTouchStartPoint = function(touch, scaleX, scaleY, rect) {
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;

    if (this.isActive) {
        this.checkButtonPress(x, y);
    }
};

/**
 * Mark button(s) as pressed if the provided point lies inside their bounds
 * @function checkButtonPress
 * @param {number} x - X coordinate in canvas space
 * @param {number} y - Y coordinate in canvas space
 * @returns {void}
 */
Menu.prototype.checkButtonPress = function(x, y) {
    Object.entries(this.buttonStates).forEach(([name, state]) => {
        if (state.bounds && this.isPointInButton(x, y, state.bounds)) {
            state.pressed = true;
        }
    });
};

/**
 * Handles touchend events by converting touch points and delegating to end processing
 * @function handleTouchEnd
 * @param {TouchEvent} e - Touch event object
 * @returns {void}
 */
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

/**
 * Process an individual touchend point and treat it like a click if appropriate
 * @function processTouchEndPoint
 * @param {Touch} touch - The touch object from the event
 * @param {number} scaleX - Horizontal canvas scale factor
 * @param {number} scaleY - Vertical canvas scale factor
 * @param {DOMRect} rect - Canvas bounding rect used for coordinate conversion
 * @returns {void}
 */
Menu.prototype.processTouchEndPoint = function(touch, scaleX, scaleY, rect) {
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;
    this.handleTouchClick(x, y);
};

/**
 * Resets all pressed states on menu buttons (called after touchend/mouseup)
 * @function resetButtonPressedStates
 * @returns {void}
 */
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

/**
 * Top-level touch click handler that mirrors mouse click handling for touch input
 * @function handleTouchClick
 * @param {number} x - X coordinate in canvas space
 * @param {number} y - Y coordinate in canvas space
 * @returns {void}
 */
Menu.prototype.handleTouchClick = function(x, y) {
    if (this.handleTouchPauseButtonClick(x, y)) return;
    if (!this.isActive) return;
    if (this.handleTouchDialogClick(x, y)) return;
    this.handleTouchMainMenuClick(x, y);
};

/**
 * Checks and handles a touch on the global pause button (outside the menu)
 * @function handleTouchPauseButtonClick
 * @param {number} x - X coordinate in canvas space
 * @param {number} y - Y coordinate in canvas space
 * @returns {boolean} True if the pause button was handled, false otherwise
 */
Menu.prototype.handleTouchPauseButtonClick = function(x, y) {
    if (!this.isActive && this.gameStarted && world && world.pauseButtonBounds) {
        if (this.isPointInButton(x, y, world.pauseButtonBounds)) {
            this.togglePause();
            return true;
        }
    }
    return false;
};

/**
 * Delegates touch clicks to the active dialog (settings/controls/pause)
 * @function handleTouchDialogClick
 * @param {number} x - X coordinate in canvas space
 * @param {number} y - Y coordinate in canvas space
 * @returns {boolean} True if a dialog handled the touch, false otherwise
 */
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

/**
 * Handles main menu touch interactions (play, settings, exit, help)
 * @function handleTouchMainMenuClick
 * @param {number} x - X coordinate in canvas space
 * @param {number} y - Y coordinate in canvas space
 * @returns {void}
 */
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
