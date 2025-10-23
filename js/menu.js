/**
 * Menu System for Return of the Wizard
 * Handles all menu rendering and interactions in the canvas
 */

class Menu {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Menu state
        this.isActive = true;
        this.currentDialog = null; // null, 'controls', 'settings'
        this.gameStarted = false;

        // Images
        this.images = {};
        this.imagesLoaded = false;

        // Button states for animations
        this.buttonStates = {
            play: { scale: 1, pressed: false },
            settings: { scale: 1, pressed: false },
            exit: { scale: 1, pressed: false },
            question: { scale: 1, pressed: false },
            close: { scale: 1, pressed: false },
            musicToggle: { scale: 1, pressed: false }
        };

        // Settings
        this.musicEnabled = true;

        // Load all images
        this.loadImages();

        // Add click listener
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    /**
     * Load all menu images
     */
    loadImages() {
        const imagePaths = {
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
            // Show loading screen
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Loading...', this.canvas.width / 2, this.canvas.height / 2);
            return;
        }

        if (!this.isActive) return;

        // Draw background
        this.ctx.drawImage(this.images.background, 0, 0, this.canvas.width, this.canvas.height);

        this.drawMainMenu();
    }

    /**
     * Draw main menu
     */
    drawMainMenu() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Draw blank menu background frame
        const menuWidth = 200;
        const menuHeight = 250;
        const menuX = centerX - menuWidth / 2;
        const menuY = centerY - menuHeight / 2 + 20; // Slightly below center

        this.ctx.drawImage(this.images.menuBlank, menuX, menuY, menuWidth, menuHeight);

        // Calculate button positions (responsive, centered in the menu frame)
        const buttonWidth = 140;
        const buttonHeight = 45;
        const buttonX = centerX - buttonWidth / 2;
        const buttonSpacing = 55;

        // Play button (top)
        const playY = menuY + 50;
        this.drawButton('play', buttonX, playY, buttonWidth, buttonHeight, this.images.playBtn);

        // Settings button (middle)
        const settingsY = playY + buttonSpacing;
        this.drawButton('settings', buttonX, settingsY, buttonWidth, buttonHeight, this.images.settingsBtn);

        // Exit button (bottom)
        const exitY = settingsY + buttonSpacing;
        this.drawButton('exit', buttonX, exitY, buttonWidth, buttonHeight, this.images.exitBtn);

        // Question icon (top right)
        const iconSize = 40;
        const iconX = this.canvas.width - iconSize - 15;
        const iconY = 15;
        this.drawButton('question', iconX, iconY, iconSize, iconSize, this.images.questionIcon);
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
        if (!this.isActive || !this.imagesLoaded) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let overButton = false;

        // Check if hovering over any button
        Object.entries(this.buttonStates).forEach(([name, state]) => {
            if (state.bounds && this.isPointInButton(x, y, state.bounds)) {
                overButton = true;
            }
        });

        this.canvas.style.cursor = overButton ? 'pointer' : 'default';
    }

    /**
     * Handle click events
     */
    handleClick(e) {
        if (!this.isActive || !this.imagesLoaded) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Main menu buttons
        const playBtn = this.buttonStates.play;
        if (playBtn.bounds && this.isPointInButton(x, y, playBtn.bounds)) {
            this.startGame();
            return;
        }

        const settingsBtn = this.buttonStates.settings;
        if (settingsBtn.bounds && this.isPointInButton(x, y, settingsBtn.bounds)) {
            console.log('Settings button clicked');
            return;
        }

        const exitBtn = this.buttonStates.exit;
        if (exitBtn.bounds && this.isPointInButton(x, y, exitBtn.bounds)) {
            this.exitGame();
            return;
        }

        const questionBtn = this.buttonStates.question;
        if (questionBtn.bounds && this.isPointInButton(x, y, questionBtn.bounds)) {
            console.log('Question button clicked');
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
}
