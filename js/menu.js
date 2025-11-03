/**
 * Menu System for Return of the Wizard
 * Handles all menu rendering and interactions in the canvas
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

    syncMusicSettings() {
        if (typeof audioManager !== 'undefined' && audioManager) {
            this.musicEnabled = audioManager.musicEnabled;
        } else {
            this.musicEnabled = true;
        }
    }

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
     * Start menu background music
     */
    startMenuMusic() {
        setTimeout(() => {
            if (typeof audioManager !== 'undefined' && audioManager) {
                audioManager.playMenuMusic();
                console.log('Menu music started');
            }
        }, 500); // Small delay to ensure audio manager is loaded
    }

    /**
     * Load all menu images
     */
    loadImages() {
        const imagePaths = this.getImagePaths();
        this.loadImageSet(imagePaths);
    }

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
     * Draw the menu
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

    drawLoadingScreen() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px PixelifySans';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Loading...', this.canvas.width / 2, this.canvas.height / 2);
    }

    drawBackground() {
        if (this.isGameOver || this.isVictory) {
            // Draw dark overlay over the game
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            // Normal mode: Draw background
            this.ctx.drawImage(this.images.background, 0, 0, this.canvas.width, this.canvas.height);
        }
    }

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
     * Draw main menu
     */
    drawMainMenu() {
        const dimensions = this.getMainMenuDimensions();
        this.drawMainMenuBackground(dimensions);
        this.drawMainMenuButtons(dimensions);
        this.drawQuestionIcon();
    }

    getMainMenuDimensions() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const menuWidth = 200;
        const menuHeight = 250;
        const menuX = centerX - menuWidth / 2;
        const menuY = centerY - menuHeight / 2 + 20;
        return { centerX, centerY, menuWidth, menuHeight, menuX, menuY };
    }

    drawMainMenuBackground(dimensions) {
        this.ctx.drawImage(this.images.menuBlank, dimensions.menuX, dimensions.menuY, dimensions.menuWidth, dimensions.menuHeight);
    }

    drawMainMenuButtons(dimensions) {
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
    }

    drawQuestionIcon() {
        const iconSize = 40;
        const iconX = this.canvas.width - iconSize - 15;
        const iconY = 15;
        this.drawButton('question', iconX, iconY, iconSize, iconSize, this.images.questionIcon);
    }

    /**
     * Draw game over menu
     */
    drawGameOverMenu() {
        this.drawEndGameMenu('Game Over');
    }

    /**
     * Draw victory menu
     */
    drawVictoryMenu() {
        this.drawEndGameMenu('Victory!');
    }

    drawEndGameMenu(title) {
        const dimensions = this.getEndGameMenuDimensions();
        this.drawEndGameTitle(title, dimensions);
        this.drawEndGameMenuFrame(dimensions);
        this.drawEndGameButtons(dimensions);
        this.drawQuestionIcon();
    }

    getEndGameMenuDimensions() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const menuWidth = 200;
        const menuHeight = 250;
        const menuX = centerX - menuWidth / 2;
        const menuY = centerY - menuHeight / 2 + 20;
        return { centerX, centerY, menuWidth, menuHeight, menuX, menuY };
    }

    drawEndGameTitle(title, dimensions) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 28px PixelifySans';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(title, dimensions.centerX, dimensions.centerY - 120);
    }

    drawEndGameMenuFrame(dimensions) {
        this.ctx.drawImage(this.images.menuBlank, dimensions.menuX, dimensions.menuY, dimensions.menuWidth, dimensions.menuHeight);
    }

    drawEndGameButtons(dimensions) {
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
    }

    /**
     * Draw settings dialog
     */
    drawSettingsDialog() {
        const dimensions = this.getSettingsDialogDimensions();
        this.drawSettingsBackground(dimensions);
        this.drawSettingsTitle(dimensions);
        this.drawMusicSection(dimensions);
        this.drawSettingsCloseButton(dimensions);
    }

    getSettingsDialogDimensions() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const menuWidth = 250;
        const menuHeight = 200;
        const menuX = centerX - menuWidth / 2;
        const menuY = centerY - menuHeight / 2;
        return { centerX, centerY, menuWidth, menuHeight, menuX, menuY };
    }

    drawSettingsBackground(dimensions) {
        this.ctx.drawImage(this.images.menuBlank, dimensions.menuX, dimensions.menuY, dimensions.menuWidth, dimensions.menuHeight);
    }

    drawSettingsTitle(dimensions) {
        this.ctx.fillStyle = '#d9d9d9ff';
        this.ctx.font = 'bold 24px PixelifySans';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Settings', dimensions.centerX, dimensions.menuY + 40);
    }

    drawMusicSection(dimensions) {
        this.ctx.font = '18px PixelifySans';
        this.ctx.fillText('Music:', dimensions.centerX, dimensions.menuY + 90);

        const musicButtonSize = 25;
        const musicButtonX = dimensions.centerX - musicButtonSize / 2;
        const musicButtonY = dimensions.menuY + 110;

        const musicIconImg = this.musicEnabled ? this.images.musicIcon : this.images.musicMuteIcon;
        this.drawButton('musicToggle', musicButtonX, musicButtonY, musicButtonSize, musicButtonSize, musicIconImg);
    }

    drawSettingsCloseButton(dimensions) {
        const closeButtonSize = 30;
        const closeButtonX = dimensions.menuX + dimensions.menuWidth - closeButtonSize - 10;
        const closeButtonY = dimensions.menuY + 10;
        this.drawButton('close', closeButtonX, closeButtonY, closeButtonSize, closeButtonSize, this.images.xBtn);
    }

    /**
     * Draw controls dialog
     */
    drawControlsDialog() {
        const dimensions = this.getControlsDialogDimensions();
        this.drawControlsBackground(dimensions);
        this.drawControlsTitle(dimensions);
        this.drawControlsText(dimensions);
        this.drawControlsCloseButton(dimensions);
    }

    getControlsDialogDimensions() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const menuWidth = 200;
        const menuHeight = 250;
        const menuX = centerX - menuWidth / 2;
        const menuY = centerY - menuHeight / 2;
        return { centerX, centerY, menuWidth, menuHeight, menuX, menuY };
    }

    drawControlsBackground(dimensions) {
        this.ctx.drawImage(this.images.menuBlank, dimensions.menuX, dimensions.menuY, dimensions.menuWidth, dimensions.menuHeight);
    }

    drawControlsTitle(dimensions) {
        this.ctx.fillStyle = '#d9d9d9ff';
        this.ctx.font = 'bold 20px PixelifySans';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('How to Play', dimensions.centerX, dimensions.menuY + 30);
    }

    drawControlsText(dimensions) {
        this.setupControlsTextStyle();
        const textPosition = this.getControlsTextPosition(dimensions);
        const controls = this.getControlsTextLines();
        this.renderControlsLines(controls, textPosition);
    }

    setupControlsTextStyle() {
        this.ctx.font = '14px PixelifySans';
        this.ctx.textAlign = 'left';
    }

    getControlsTextPosition(dimensions) {
        return {
            textX: dimensions.menuX + 15,
            textY: dimensions.menuY + 60,
            lineHeight: 20
        };
    }

    getControlsTextLines() {
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
    }

    renderControlsLines(controls, textPosition) {
        let textY = textPosition.textY;
        controls.forEach(line => {
            if (line === '') {
                textY += textPosition.lineHeight / 2;
            } else {
                this.ctx.fillText(line, textPosition.textX, textY);
                textY += textPosition.lineHeight;
            }
        });
    }

    drawControlsCloseButton(dimensions) {
        const closeButtonSize = 30;
        const closeButtonX = dimensions.menuX + dimensions.menuWidth - closeButtonSize - 10;
        const closeButtonY = dimensions.menuY + 10;
        this.drawButton('close', closeButtonX, closeButtonY, closeButtonSize, closeButtonSize, this.images.xBtn);
    }

    /**
     * Draw a button with animation
     */
    drawButton(buttonName, x, y, width, height, image) {
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
    }

    /**
     * Clear button bounds for buttons that are not currently visible
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

    clearMainMenuBounds() {
        ['play', 'settings', 'exit', 'question'].forEach(name => {
            if (this.buttonStates[name]) {
                this.buttonStates[name].bounds = null;
            }
        });
    }

    clearPauseMenuBounds() {
        ['play', 'settings', 'question'].forEach(name => {
            if (this.buttonStates[name]) {
                this.buttonStates[name].bounds = null;
            }
        });
    }

    clearDialogBounds() {
        ['musicToggle', 'close', 'resume'].forEach(name => {
            if (this.buttonStates[name]) {
                this.buttonStates[name].bounds = null;
            }
        });
    }


    /**
     * Handle mouse down
     */
    handleMouseDown(e) {
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
    }

    /**
     * Handle mouse up
     */
    handleMouseUp(e) {
        if (!this.isActive || !this.imagesLoaded) return;

        // Reset all pressed states
        Object.values(this.buttonStates).forEach(state => {
            state.pressed = false;
        });
    }

    /**
     * Handle mouse move for hover effects
     */
    handleMouseMove(e) {
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
    }

    /**
     * Handle click events
     */
    handleClick(e) {
        if (!this.imagesLoaded) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.handlePauseButtonClick(x, y)) return;
        if (!this.isActive) return;
        if (this.handleDialogClick(x, y)) return;
        this.handleMainMenuClick(x, y);
    }

    handlePauseButtonClick(x, y) {
        if (!this.isActive && this.gameStarted && world && world.pauseButtonBounds) {
            if (this.isPointInButton(x, y, world.pauseButtonBounds)) {
                this.togglePause();
                return true;
            }
        }
        return false;
    }

    handleDialogClick(x, y) {
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
    }

    handleMainMenuClick(x, y) {
        if (this.checkPlayButtonClick(x, y)) return;
        if (this.checkSettingsButtonClick(x, y)) return;
        if (this.checkExitButtonClick(x, y)) return;
        if (this.checkQuestionButtonClick(x, y)) return;
    }

    checkPlayButtonClick(x, y) {
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
    }

    checkSettingsButtonClick(x, y) {
        const settingsBtn = this.buttonStates.settings;
        if (settingsBtn.bounds && this.isPointInButton(x, y, settingsBtn.bounds)) {
            this.openSettings();
            return true;
        }
        return false;
    }

    checkExitButtonClick(x, y) {
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
    }

    checkQuestionButtonClick(x, y) {
        const questionBtn = this.buttonStates.question;
        if (questionBtn.bounds && this.isPointInButton(x, y, questionBtn.bounds)) {
            this.openControls();
            return true;
        }
        return false;
    }

    /**
     * Handle settings dialog clicks
     */
    handleSettingsClick(x, y) {
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
    }

    /**
     * Handle controls dialog clicks
     */
    handleControlsClick(x, y) {
        // Close button
        const closeBtn = this.buttonStates.close;
        if (closeBtn.bounds && this.isPointInButton(x, y, closeBtn.bounds)) {
            this.closeControls();
            return;
        }
    }

    /**
     * Handle pause dialog clicks
     */
    handlePauseClick(x, y) {
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
    }

    /**
     * Check if point is inside button bounds
     */
    isPointInButton(x, y, bounds) {
        return x >= bounds.x && x <= bounds.x + bounds.width &&
               y >= bounds.y && y <= bounds.y + bounds.height;
    }

    /**
     * Start the game
     */
    startGame() {
        console.log('Starting game...');
        this.isActive = false;
        this.gameStarted = true;

        // Initialize the actual game
        if (typeof initGame === 'function') {
            initGame();
        }
    }


    /**
     * Exit game
     */
    exitGame() {
        console.log('Exit button clicked');
        // TODO: Implement exit functionality
    }

    /**
     * Open settings dialog
     */
    openSettings() {
        console.log('Opening settings...');
        this.previousDialog = null;
        this.currentDialog = 'settings';
    }

    /**
     * Close settings dialog
     */
    closeSettings() {
        console.log('Closing settings...');
        if (this.previousDialog === 'pause') {
            this.currentDialog = 'pause';
            this.previousDialog = null;
        } else {
            this.currentDialog = null;
        }
    }

    /**
     * Toggle music on/off
     */
    toggleMusic() {
        // Use Audio Manager if available
        if (typeof audioManager !== 'undefined' && audioManager) {
            this.musicEnabled = audioManager.toggleMusic();
        } else {
            this.musicEnabled = !this.musicEnabled;
        }
        
        console.log('Music toggled:', this.musicEnabled ? 'ON' : 'OFF');
    }

    /**
     * Open controls dialog
     */
    openControls() {
        console.log('Opening controls...');
        this.currentDialog = 'controls';
    }

    /**
     * Close controls dialog
     */
    closeControls() {
        console.log('Closing controls...');
        this.currentDialog = null;
    }

    /**
     * Show game over screen
     */
    showGameOver() {
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
    }

    /**
     * Show victory screen
     */
    showVictory() {
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
    }

    /**
     * Restart the game from game over
     */
    restartGame() {
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
    }

    /**
     * Return to main menu from game over
     */
    returnToMainMenu() {
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
    }

    /**
     * Draw pause dialog
     */
    drawPauseDialog() {
        this.drawPauseOverlay();
        const dimensions = this.getPauseDialogDimensions();
        this.drawPauseBackground(dimensions);
        this.drawPauseTitle(dimensions);
        this.drawPauseButtons(dimensions);
    }

    drawPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getPauseDialogDimensions() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const menuWidth = 200;
        const menuHeight = 230;
        const menuX = centerX - menuWidth / 2;
        const menuY = centerY - menuHeight / 2;
        return { centerX, centerY, menuWidth, menuHeight, menuX, menuY };
    }

    drawPauseBackground(dimensions) {
        this.ctx.drawImage(this.images.menuBlank, dimensions.menuX, dimensions.menuY, dimensions.menuWidth, dimensions.menuHeight);
    }

    drawPauseTitle(dimensions) {
        this.ctx.fillStyle = '#d9d9d9ff';
        this.ctx.font = 'bold 28px PixelifySans';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Paused', dimensions.centerX, dimensions.menuY + 45);
    }

    drawPauseButtons(dimensions) {
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
    }

    /**
     * Toggle pause state
     */
    togglePause() {
        if (!world) return;

        if (world.isPaused) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }

    /**
     * Pause the game
     */
    pauseGame() {
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
    }

    /**
     * Resume the game
     */
    resumeGame() {
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
    }

    /**
     * Exit to main menu from pause
     */
    exitToMainMenu() {
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
    }

    /**
     * Open settings from pause menu
     */
    openSettingsFromPause() {
        console.log('Opening settings from pause...');
        this.previousDialog = 'pause';
        this.currentDialog = 'settings';
    }

    /**
     * Handle touch start event (similar to mouse down)
     */
    handleTouchStart(e) {
        e.preventDefault();
        if (!this.imagesLoaded) return;

        const { scaleX, scaleY, rect } = this.getTouchScaleFactors();

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            this.processTouchStartPoint(touch, scaleX, scaleY, rect);
        }
    }

    getTouchScaleFactors() {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return { scaleX, scaleY, rect };
    }

    processTouchStartPoint(touch, scaleX, scaleY, rect) {
        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        if (this.isActive) {
            this.checkButtonPress(x, y);
        }
    }

    checkButtonPress(x, y) {
        Object.entries(this.buttonStates).forEach(([name, state]) => {
            if (state.bounds && this.isPointInButton(x, y, state.bounds)) {
                state.pressed = true;
            }
        });
    }

    /**
     * Handle touch end event (similar to mouse up + click)
     */
    handleTouchEnd(e) {
        e.preventDefault();
        if (!this.imagesLoaded) return;

        const { scaleX, scaleY, rect } = this.getTouchScaleFactors();

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            this.processTouchEndPoint(touch, scaleX, scaleY, rect);
        }

        this.resetButtonPressedStates();
    }

    processTouchEndPoint(touch, scaleX, scaleY, rect) {
        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;
        this.handleTouchClick(x, y);
    }

    resetButtonPressedStates() {
        if (this.isActive) {
            Object.values(this.buttonStates).forEach(state => {
                state.pressed = false;
            });
        }
    }

    /**
     * Handle touch move event (for hover effects)
     */
    handleTouchMove(e) {
        e.preventDefault();
        // Touch move doesn't need special handling for menus
    }

    /**
     * Handle touch click (replaces handleClick for touch)
     */
    handleTouchClick(x, y) {
        if (this.handleTouchPauseButtonClick(x, y)) return;
        if (!this.isActive) return;
        if (this.handleTouchDialogClick(x, y)) return;
        this.handleTouchMainMenuClick(x, y);
    }

    handleTouchPauseButtonClick(x, y) {
        if (!this.isActive && this.gameStarted && world && world.pauseButtonBounds) {
            if (this.isPointInButton(x, y, world.pauseButtonBounds)) {
                this.togglePause();
                return true;
            }
        }
        return false;
    }

    handleTouchDialogClick(x, y) {
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
    }

    handleTouchMainMenuClick(x, y) {
        if (this.checkPlayButtonClick(x, y)) return;
        if (this.checkSettingsButtonClick(x, y)) return;
        if (this.checkExitButtonClick(x, y)) return;
        if (this.checkQuestionButtonClick(x, y)) return;
    }
}
