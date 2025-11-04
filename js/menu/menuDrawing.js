/**
 * Menu Drawing Functions
 * Contains all drawing-related methods for the menu system
 */

// Main Menu Drawing
Menu.prototype.drawMainMenu = function() {
    const dimensions = this.getMainMenuDimensions();
    this.drawMainMenuBackground(dimensions);
    this.drawMainMenuButtons(dimensions);
    this.drawQuestionIcon();
};

Menu.prototype.getMainMenuDimensions = function() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const menuWidth = 200;
    const menuHeight = 250;
    const menuX = centerX - menuWidth / 2;
    const menuY = centerY - menuHeight / 2 + 20;
    return { centerX, centerY, menuWidth, menuHeight, menuX, menuY };
};

Menu.prototype.drawMainMenuBackground = function(dimensions) {
    this.ctx.drawImage(this.images.menuBlank, dimensions.menuX, dimensions.menuY, dimensions.menuWidth, dimensions.menuHeight);
};

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

Menu.prototype.drawQuestionIcon = function() {
    const iconSize = 40;
    const iconX = this.canvas.width - iconSize - 15;
    const iconY = 15;
    this.drawButton('question', iconX, iconY, iconSize, iconSize, this.images.questionIcon);
};

// Game Over/Victory Menu Drawing
Menu.prototype.drawGameOverMenu = function() {
    this.drawEndGameMenu('Game Over');
};

Menu.prototype.drawVictoryMenu = function() {
    this.drawEndGameMenu('Victory!');
};

Menu.prototype.drawEndGameMenu = function(title) {
    const dimensions = this.getEndGameMenuDimensions();
    this.drawEndGameTitle(title, dimensions);
    this.drawEndGameMenuFrame(dimensions);
    this.drawEndGameButtons(dimensions);
    this.drawQuestionIcon();
};

Menu.prototype.getEndGameMenuDimensions = function() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const menuWidth = 200;
    const menuHeight = 250;
    const menuX = centerX - menuWidth / 2;
    const menuY = centerY - menuHeight / 2 + 20;
    return { centerX, centerY, menuWidth, menuHeight, menuX, menuY };
};

Menu.prototype.drawEndGameTitle = function(title, dimensions) {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 28px PixelifySans';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(title, dimensions.centerX, dimensions.centerY - 120);
};

Menu.prototype.drawEndGameMenuFrame = function(dimensions) {
    this.ctx.drawImage(this.images.menuBlank, dimensions.menuX, dimensions.menuY, dimensions.menuWidth, dimensions.menuHeight);
};

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

// Settings Dialog Drawing
Menu.prototype.drawSettingsDialog = function() {
    const dimensions = this.getSettingsDialogDimensions();
    this.drawSettingsBackground(dimensions);
    this.drawSettingsTitle(dimensions);
    this.drawMusicSection(dimensions);
    this.drawSettingsCloseButton(dimensions);
};

Menu.prototype.getSettingsDialogDimensions = function() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const menuWidth = 250;
    const menuHeight = 200;
    const menuX = centerX - menuWidth / 2;
    const menuY = centerY - menuHeight / 2;
    return { centerX, centerY, menuWidth, menuHeight, menuX, menuY };
};

Menu.prototype.drawSettingsBackground = function(dimensions) {
    this.ctx.drawImage(this.images.menuBlank, dimensions.menuX, dimensions.menuY, dimensions.menuWidth, dimensions.menuHeight);
};

Menu.prototype.drawSettingsTitle = function(dimensions) {
    this.ctx.fillStyle = '#d9d9d9ff';
    this.ctx.font = 'bold 24px PixelifySans';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Settings', dimensions.centerX, dimensions.menuY + 40);
};

Menu.prototype.drawMusicSection = function(dimensions) {
    this.ctx.font = '18px PixelifySans';
    this.ctx.fillText('Music:', dimensions.centerX, dimensions.menuY + 90);

    const musicButtonSize = 25;
    const musicButtonX = dimensions.centerX - musicButtonSize / 2;
    const musicButtonY = dimensions.menuY + 110;

    const musicIconImg = this.musicEnabled ? this.images.musicIcon : this.images.musicMuteIcon;
    this.drawButton('musicToggle', musicButtonX, musicButtonY, musicButtonSize, musicButtonSize, musicIconImg);
};

Menu.prototype.drawSettingsCloseButton = function(dimensions) {
    const closeButtonSize = 30;
    const closeButtonX = dimensions.menuX + dimensions.menuWidth - closeButtonSize - 10;
    const closeButtonY = dimensions.menuY + 10;
    this.drawButton('close', closeButtonX, closeButtonY, closeButtonSize, closeButtonSize, this.images.xBtn);
};

// Controls Dialog Drawing
Menu.prototype.drawControlsDialog = function() {
    const dimensions = this.getControlsDialogDimensions();
    this.drawControlsBackground(dimensions);
    this.drawControlsTitle(dimensions);
    this.drawControlsText(dimensions);
    this.drawControlsCloseButton(dimensions);
};

Menu.prototype.getControlsDialogDimensions = function() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const menuWidth = 200;
    const menuHeight = 250;
    const menuX = centerX - menuWidth / 2;
    const menuY = centerY - menuHeight / 2;
    return { centerX, centerY, menuWidth, menuHeight, menuX, menuY };
};

Menu.prototype.drawControlsBackground = function(dimensions) {
    this.ctx.drawImage(this.images.menuBlank, dimensions.menuX, dimensions.menuY, dimensions.menuWidth, dimensions.menuHeight);
};

Menu.prototype.drawControlsTitle = function(dimensions) {
    this.ctx.fillStyle = '#d9d9d9ff';
    this.ctx.font = 'bold 20px PixelifySans';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('How to Play', dimensions.centerX, dimensions.menuY + 30);
};

Menu.prototype.drawControlsText = function(dimensions) {
    this.setupControlsTextStyle();
    const textPosition = this.getControlsTextPosition(dimensions);
    const controls = this.getControlsTextLines();
    this.renderControlsLines(controls, textPosition);
};

Menu.prototype.setupControlsTextStyle = function() {
    this.ctx.font = '14px PixelifySans';
    this.ctx.textAlign = 'left';
};

Menu.prototype.getControlsTextPosition = function(dimensions) {
    return {
        textX: dimensions.menuX + 15,
        textY: dimensions.menuY + 60,
        lineHeight: 20
    };
};

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

Menu.prototype.drawControlsCloseButton = function(dimensions) {
    const closeButtonSize = 30;
    const closeButtonX = dimensions.menuX + dimensions.menuWidth - closeButtonSize - 10;
    const closeButtonY = dimensions.menuY + 10;
    this.drawButton('close', closeButtonX, closeButtonY, closeButtonSize, closeButtonSize, this.images.xBtn);
};

// Button Drawing
Menu.prototype.drawButton = function(buttonName, x, y, width, height, image) {
    const state = this.buttonStates[buttonName];

    // Smooth animation
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

    // Store button bounds for click detection
    this.buttonStates[buttonName].bounds = { x, y, width, height };
};

// Pause Dialog Drawing
Menu.prototype.drawPauseDialog = function() {
    this.drawPauseOverlay();
    const dimensions = this.getPauseDialogDimensions();
    this.drawPauseBackground(dimensions);
    this.drawPauseTitle(dimensions);
    this.drawPauseButtons(dimensions);
};

Menu.prototype.drawPauseOverlay = function() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

Menu.prototype.getPauseDialogDimensions = function() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const menuWidth = 200;
    const menuHeight = 230;
    const menuX = centerX - menuWidth / 2;
    const menuY = centerY - menuHeight / 2;
    return { centerX, centerY, menuWidth, menuHeight, menuX, menuY };
};

Menu.prototype.drawPauseBackground = function(dimensions) {
    this.ctx.drawImage(this.images.menuBlank, dimensions.menuX, dimensions.menuY, dimensions.menuWidth, dimensions.menuHeight);
};

Menu.prototype.drawPauseTitle = function(dimensions) {
    this.ctx.fillStyle = '#d9d9d9ff';
    this.ctx.font = 'bold 28px PixelifySans';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Paused', dimensions.centerX, dimensions.menuY + 45);
};

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
