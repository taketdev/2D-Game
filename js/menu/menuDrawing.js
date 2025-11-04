/**
 * Menu Drawing Functions
 * Contains all drawing-related methods for the menu system
 */

/**
 * Draws the main menu with background, buttons and question icon
 * @function drawMainMenu
 * @returns {void}
 */
Menu.prototype.drawMainMenu = function() {
    const dimensions = this.getMainMenuDimensions();
    this.drawMainMenuBackground(dimensions);
    this.drawMainMenuButtons(dimensions);
    this.drawQuestionIcon();
};

/**
 * Calculates dimensions and positions for main menu elements
 * @function getMainMenuDimensions
 * @returns {Object} Object containing position and size values
 */
Menu.prototype.getMainMenuDimensions = function() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const menuWidth = 200;
    const menuHeight = 250;
    const menuX = centerX - menuWidth / 2;
    const menuY = centerY - menuHeight / 2 + 20;
    return { centerX, centerY, menuWidth, menuHeight, menuX, menuY };
};

/**
 * Draws the main menu background frame
 * @function drawMainMenuBackground
 * @param {Object} dimensions - Menu dimensions object
 * @returns {void}
 */
Menu.prototype.drawMainMenuBackground = function(dimensions) {
    this.ctx.drawImage(this.images.menuBlank, dimensions.menuX, dimensions.menuY, dimensions.menuWidth, dimensions.menuHeight);
};

/**
 * Draws main menu buttons (play, settings, exit) with proper positioning
 * @function drawMainMenuButtons
 * @param {Object} dimensions - Menu dimensions object
 * @returns {void}
 */
Menu.prototype.drawMainMenuButtons = function(dimensions) {
    const buttonWidth = 140;
    const buttonHeight = 45;
    const buttonX = dimensions.centerX - buttonWidth / 2;
    const buttonSpacing = 55;

    const playY = dimensions.menuY + 50;
    this.drawButton('play', buttonX, playY, buttonWidth, buttonHeight, this.images.playBtn);

    const settingsY = playY + buttonSpacing;
    this.drawButton('settings', buttonX, settingsY, buttonWidth, buttonHeight, this.images.settingsBtn);

    const exitY = settingsY + buttonSpacing;
    this.drawButton('exit', buttonX, exitY, buttonWidth, buttonHeight, this.images.exitBtn);
};

/**
 * Draws the question icon in the top right corner
 * @function drawQuestionIcon
 * @returns {void}
 */
Menu.prototype.drawQuestionIcon = function() {
    const iconSize = 40;
    const iconX = this.canvas.width - iconSize - 15;
    const iconY = 15;
    this.drawButton('question', iconX, iconY, iconSize, iconSize, this.images.questionIcon);
};

/**
 * Draws game over menu with title and options
 * @function drawGameOverMenu
 * @returns {void}
 */
Menu.prototype.drawGameOverMenu = function() {
    this.drawEndGameMenu('Game Over');
};

/**
 * Draws victory menu with title and options
 * @function drawVictoryMenu
 * @returns {void}
 */
Menu.prototype.drawVictoryMenu = function() {
    this.drawEndGameMenu('Victory!');
};

/**
 * Draws end game menu with title, frame and buttons
 * @function drawEndGameMenu
 * @param {string} title - Title text to display
 * @returns {void}
 */
Menu.prototype.drawEndGameMenu = function(title) {
    const dimensions = this.getEndGameMenuDimensions();
    this.drawEndGameTitle(title, dimensions);
    this.drawEndGameMenuFrame(dimensions);
    this.drawEndGameButtons(dimensions);
    this.drawQuestionIcon();
};

/**
 * Calculates dimensions for end game menu
 * @function getEndGameMenuDimensions
 * @returns {Object} Object containing position and size values
 */
Menu.prototype.getEndGameMenuDimensions = function() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const menuWidth = 200;
    const menuHeight = 250;
    const menuX = centerX - menuWidth / 2;
    const menuY = centerY - menuHeight / 2 + 20;
    return { centerX, centerY, menuWidth, menuHeight, menuX, menuY };
};

/**
 * Draws the title text for end game menus
 * @function drawEndGameTitle
 * @param {string} title - Title text to display
 * @param {Object} dimensions - Menu dimensions object
 * @returns {void}
 */
Menu.prototype.drawEndGameTitle = function(title, dimensions) {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 28px PixelifySans';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(title, dimensions.centerX, dimensions.centerY - 120);
};

/**
 * Draws the background frame for end game menus
 * @function drawEndGameMenuFrame
 * @param {Object} dimensions - Menu dimensions object
 * @returns {void}
 */
Menu.prototype.drawEndGameMenuFrame = function(dimensions) {
    this.ctx.drawImage(this.images.menuBlank, dimensions.menuX, dimensions.menuY, dimensions.menuWidth, dimensions.menuHeight);
};

/**
 * Draws buttons for end game menus (play, settings, exit)
 * @function drawEndGameButtons
 * @param {Object} dimensions - Menu dimensions object
 * @returns {void}
 */
Menu.prototype.drawEndGameButtons = function(dimensions) {
    const buttonWidth = 140;
    const buttonHeight = 45;
    const buttonX = dimensions.centerX - buttonWidth / 2;
    const buttonSpacing = 55;

    const playY = dimensions.menuY + 50;
    this.drawButton('play', buttonX, playY, buttonWidth, buttonHeight, this.images.playBtn);

    const settingsY = playY + buttonSpacing;
    this.drawButton('settings', buttonX, settingsY, buttonWidth, buttonHeight, this.images.settingsBtn);

    const exitY = settingsY + buttonSpacing;
    this.drawButton('exit', buttonX, exitY, buttonWidth, buttonHeight, this.images.exitBtn);
};

/**
 * Draws settings dialog with background, title, music toggle and close button
 * @function drawSettingsDialog
 * @returns {void}
 */
Menu.prototype.drawSettingsDialog = function() {
    const dimensions = this.getSettingsDialogDimensions();
    this.drawSettingsBackground(dimensions);
    this.drawSettingsTitle(dimensions);
    this.drawMusicSection(dimensions);
    this.drawSettingsCloseButton(dimensions);
};

/**
 * Calculates dimensions for settings dialog
 * @function getSettingsDialogDimensions
 * @returns {Object} Object containing position and size values
 */
Menu.prototype.getSettingsDialogDimensions = function() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const menuWidth = 250;
    const menuHeight = 200;
    const menuX = centerX - menuWidth / 2;
    const menuY = centerY - menuHeight / 2;
    return { centerX, centerY, menuWidth, menuHeight, menuX, menuY };
};

/**
 * Draws the background for settings dialog
 * @function drawSettingsBackground
 * @param {Object} dimensions - Menu dimensions object
 * @returns {void}
 */
Menu.prototype.drawSettingsBackground = function(dimensions) {
    this.ctx.drawImage(this.images.menuBlank, dimensions.menuX, dimensions.menuY, dimensions.menuWidth, dimensions.menuHeight);
};

/**
 * Draws the title for settings dialog
 * @function drawSettingsTitle
 * @param {Object} dimensions - Menu dimensions object
 * @returns {void}
 */
Menu.prototype.drawSettingsTitle = function(dimensions) {
    this.ctx.fillStyle = '#d9d9d9ff';
    this.ctx.font = 'bold 24px PixelifySans';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Settings', dimensions.centerX, dimensions.menuY + 40);
};

/**
 * Draws the music section with toggle button
 * @function drawMusicSection
 * @param {Object} dimensions - Menu dimensions object
 * @returns {void}
 */
Menu.prototype.drawMusicSection = function(dimensions) {
    this.ctx.font = '18px PixelifySans';
    this.ctx.fillText('Music:', dimensions.centerX, dimensions.menuY + 90);

    const musicButtonSize = 25;
    const musicButtonX = dimensions.centerX - musicButtonSize / 2;
    const musicButtonY = dimensions.menuY + 110;

    const musicIconImg = this.musicEnabled ? this.images.musicIcon : this.images.musicMuteIcon;
    this.drawButton('musicToggle', musicButtonX, musicButtonY, musicButtonSize, musicButtonSize, musicIconImg);
};

/**
 * Draws the close button for settings dialog
 * @function drawSettingsCloseButton
 * @param {Object} dimensions - Menu dimensions object
 * @returns {void}
 */
Menu.prototype.drawSettingsCloseButton = function(dimensions) {
    const closeButtonSize = 30;
    const closeButtonX = dimensions.menuX + dimensions.menuWidth - closeButtonSize - 10;
    const closeButtonY = dimensions.menuY + 10;
    this.drawButton('close', closeButtonX, closeButtonY, closeButtonSize, closeButtonSize, this.images.xBtn);
};

/**
 * Draws controls dialog with game instructions
 * @function drawControlsDialog
 * @returns {void}
 */
Menu.prototype.drawControlsDialog = function() {
    const dimensions = this.getControlsDialogDimensions();
    this.drawControlsBackground(dimensions);
    this.drawControlsTitle(dimensions);
    this.drawControlsText(dimensions);
    this.drawControlsCloseButton(dimensions);
};

/**
 * Calculates dimensions for controls dialog
 * @function getControlsDialogDimensions
 * @returns {Object} Object containing position and size values
 */
Menu.prototype.getControlsDialogDimensions = function() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const menuWidth = 200;
    const menuHeight = 250;
    const menuX = centerX - menuWidth / 2;
    const menuY = centerY - menuHeight / 2;
    return { centerX, centerY, menuWidth, menuHeight, menuX, menuY };
};

/**
 * Draws the background for controls dialog
 * @function drawControlsBackground
 * @param {Object} dimensions - Menu dimensions object
 * @returns {void}
 */
Menu.prototype.drawControlsBackground = function(dimensions) {
    this.ctx.drawImage(this.images.menuBlank, dimensions.menuX, dimensions.menuY, dimensions.menuWidth, dimensions.menuHeight);
};

/**
 * Draws the title for controls dialog
 * @function drawControlsTitle
 * @param {Object} dimensions - Menu dimensions object
 * @returns {void}
 */
Menu.prototype.drawControlsTitle = function(dimensions) {
    this.ctx.fillStyle = '#d9d9d9ff';
    this.ctx.font = 'bold 20px PixelifySans';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('How to Play', dimensions.centerX, dimensions.menuY + 30);
};

/**
 * Draws the control instructions text
 * @function drawControlsText
 * @param {Object} dimensions - Menu dimensions object
 * @returns {void}
 */
Menu.prototype.drawControlsText = function(dimensions) {
    this.setupControlsTextStyle();
    const textPosition = this.getControlsTextPosition(dimensions);
    const controls = this.getControlsTextLines();
    this.renderControlsLines(controls, textPosition);
};

/**
 * Sets up text style for controls instructions
 * @function setupControlsTextStyle
 * @returns {void}
 */
Menu.prototype.setupControlsTextStyle = function() {
    this.ctx.font = '14px PixelifySans';
    this.ctx.textAlign = 'left';
};

/**
 * Gets text position for controls instructions
 * @function getControlsTextPosition
 * @param {Object} dimensions - Menu dimensions object
 * @returns {Object} Object with text position and spacing
 */
Menu.prototype.getControlsTextPosition = function(dimensions) {
    return {
        textX: dimensions.menuX + 15,
        textY: dimensions.menuY + 60,
        lineHeight: 20
    };
};

/**
 * Returns array of control instruction text lines
 * @function getControlsTextLines
 * @returns {string[]} Array of instruction strings
 */
Menu.prototype.getControlsTextLines = function() {
    return [
        '← → Arrow Keys: Move',
        '↑ Arrow Key: Jump',
        'D: Attack 1',
        'E: Attack 2',
        'SPACE: Special Attack',
        '',
        'Collect scrolls to gain',
        'experience and power!',
        '',
        'Defeat all enemies to win!'
    ];
};

/**
 * Renders control instruction lines with proper spacing
 * @function renderControlsLines
 * @param {string[]} controls - Array of control instruction strings
 * @param {Object} textPosition - Text position and spacing object
 * @returns {void}
 */
Menu.prototype.renderControlsLines = function(controls, textPosition) {
    let textY = textPosition.textY;
    controls.forEach(line => {
        if (line === '') {
            textY += textPosition.lineHeight / 2;
        } else {
            this.ctx.fillText(line, textPosition.textX, textY);
            textY += textPosition.lineHeight;
        }
    });
};

/**
 * Draws the close button for controls dialog
 * @function drawControlsCloseButton
 * @param {Object} dimensions - Menu dimensions object
 * @returns {void}
 */
Menu.prototype.drawControlsCloseButton = function(dimensions) {
    const closeButtonSize = 30;
    const closeButtonX = dimensions.menuX + dimensions.menuWidth - closeButtonSize - 10;
    const closeButtonY = dimensions.menuY + 10;
    this.drawButton('close', closeButtonX, closeButtonY, closeButtonSize, closeButtonSize, this.images.xBtn);
};

/**
 * Draws a button with scaling animation and stores bounds for click detection
 * @function drawButton
 * @param {string} buttonName - Name of the button for state tracking
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Button width
 * @param {number} height - Button height
 * @param {Image} image - Button image to draw
 * @returns {void}
 */
Menu.prototype.drawButton = function(buttonName, x, y, width, height, image) {
    const state = this.buttonStates[buttonName];

    if (state.pressed) {
        state.scale = Math.max(0.9, state.scale - 0.1);
    } else {
        state.scale = Math.min(1, state.scale + 0.05);
    }

    const scaledWidth = width * state.scale;
    const scaledHeight = height * state.scale;
    const offsetX = (width - scaledWidth) / 2;
    const offsetY = (height - scaledHeight) / 2;

    this.ctx.drawImage(image, x + offsetX, y + offsetY, scaledWidth, scaledHeight);

    this.buttonStates[buttonName].bounds = { x, y, width, height };
};

/**
 * Draws pause dialog with overlay, background and buttons
 * @function drawPauseDialog
 * @returns {void}
 */
Menu.prototype.drawPauseDialog = function() {
    this.drawPauseOverlay();
    const dimensions = this.getPauseDialogDimensions();
    this.drawPauseBackground(dimensions);
    this.drawPauseTitle(dimensions);
    this.drawPauseButtons(dimensions);
};

/**
 * Draws semi-transparent overlay for pause dialog
 * @function drawPauseOverlay
 * @returns {void}
 */
Menu.prototype.drawPauseOverlay = function() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

/**
 * Calculates dimensions for pause dialog
 * @function getPauseDialogDimensions
 * @returns {Object} Object containing position and size values
 */
Menu.prototype.getPauseDialogDimensions = function() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const menuWidth = 200;
    const menuHeight = 230;
    const menuX = centerX - menuWidth / 2;
    const menuY = centerY - menuHeight / 2;
    return { centerX, centerY, menuWidth, menuHeight, menuX, menuY };
};

/**
 * Draws the background for pause dialog
 * @function drawPauseBackground
 * @param {Object} dimensions - Menu dimensions object
 * @returns {void}
 */
Menu.prototype.drawPauseBackground = function(dimensions) {
    this.ctx.drawImage(this.images.menuBlank, dimensions.menuX, dimensions.menuY, dimensions.menuWidth, dimensions.menuHeight);
};

/**
 * Draws the title for pause dialog
 * @function drawPauseTitle
 * @param {Object} dimensions - Menu dimensions object
 * @returns {void}
 */
Menu.prototype.drawPauseTitle = function(dimensions) {
    this.ctx.fillStyle = '#d9d9d9ff';
    this.ctx.font = 'bold 28px PixelifySans';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Paused', dimensions.centerX, dimensions.menuY + 45);
};

/**
 * Draws buttons for pause dialog (resume, settings, exit)
 * @function drawPauseButtons
 * @param {Object} dimensions - Menu dimensions object
 * @returns {void}
 */
Menu.prototype.drawPauseButtons = function(dimensions) {
    const buttonWidth = 140;
    const buttonHeight = 45;
    const buttonX = dimensions.centerX - buttonWidth / 2;
    const buttonSpacing = 55;

    const resumeY = dimensions.menuY + 75;
    this.drawButton('resume', buttonX, resumeY, buttonWidth, buttonHeight, this.images.playBtn);

    const settingsY = resumeY + buttonSpacing;
    this.drawButton('settings', buttonX, settingsY, buttonWidth, buttonHeight, this.images.settingsBtn);

    const exitY = settingsY + buttonSpacing;
    this.drawButton('exit', buttonX, exitY, buttonWidth, buttonHeight, this.images.exitBtn);
};
