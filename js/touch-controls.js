/**
 * Touch Controls for Mobile/Tablet
 * Handles all touch input for game controls
 */

/**
 * Detects if the current device is a mobile device or tablet based on user agent, touch support or screen width
 * @function isMobileDevice
 * @returns {boolean} True if device is mobile or tablet, false otherwise
 */
function isMobileDevice() {
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Tablet/i.test(navigator.userAgent);
    const isTabletUserAgent = /iPad|Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth <= 1024;

    return hasTouchScreen || isMobileUserAgent || isTabletUserAgent || isSmallScreen;
}

let touchControls = null;

/**
 * TouchControls Class
 * Manages touch buttons and connects to keyboard object
 */
class TouchControls {
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;

        this.activeTouches = {};

        this.buttons = this.defineButtons();

        this.registerTouchEvents();
    }

    /**
     * Defines all touch button positions and properties by calculating sizes and positions
     * @function defineButtons
     * @returns {Object} Object containing button definitions with position and styling data
     */
    defineButtons() {
        const sizes = this.getButtonSizes();
        const positions = this.calculateButtonPositions(sizes);
        return this.createButtonDefinitions(sizes, positions);
    }

    /**
     * Calculates button sizes based on canvas dimensions
     * @function getButtonSizes
     * @returns {Object} Object containing size and spacing values for buttons
     */
    getButtonSizes() {
        return {
            buttonSize: 60,
            smallButtonSize: 50,
            padding: 15,
            rightButtonOffset: 50,
            canvasWidth: this.canvas.width,
            canvasHeight: this.canvas.height
        };
    }

    /**
     * Calculates button positions based on size parameters and canvas dimensions
     * @function calculateButtonPositions
     * @param {Object} sizes - Size configuration object
     * @returns {Object} Object containing calculated x,y positions for all buttons
     */
    calculateButtonPositions(sizes) {
        const { buttonSize, smallButtonSize, padding, rightButtonOffset, canvasWidth, canvasHeight } = sizes;

        return {
            leftX: padding,
            rightX: padding + buttonSize + 10,
            shiftX: padding + (buttonSize / 2) + 5,
            bottomY: canvasHeight - buttonSize - padding,
            shiftY: canvasHeight - buttonSize * 2 - padding - 10,
            jumpX: canvasWidth - buttonSize - padding - rightButtonOffset,
            attack1X: canvasWidth - buttonSize * 2 - padding - 10 - rightButtonOffset,
            attack2X: canvasWidth - buttonSize * 3 - padding - 20 - rightButtonOffset
        };
    }

    /**
     * Creates button definition objects with all necessary properties for rendering and touch detection
     * @function createButtonDefinitions
     * @param {Object} sizes - Size configuration object
     * @param {Object} positions - Position configuration object
     * @returns {Object} Complete button definitions with coordinates, labels, keys and colors
     */
    createButtonDefinitions(sizes, positions) {
        const { buttonSize, smallButtonSize } = sizes;

        return {
            left: { x: positions.leftX, y: positions.bottomY, width: buttonSize, height: buttonSize, label: '←', key: 'LEFT', color: 'rgba(45, 74, 62, 0.7)' },
            right: { x: positions.rightX, y: positions.bottomY, width: buttonSize, height: buttonSize, label: '→', key: 'RIGHT', color: 'rgba(45, 74, 62, 0.7)' },
            shift: { x: positions.shiftX, y: positions.shiftY, width: smallButtonSize, height: smallButtonSize, label: '⚡', key: 'SHIFT', color: 'rgba(90, 138, 112, 0.7)' },
            jump: { x: positions.jumpX, y: positions.bottomY, width: buttonSize, height: buttonSize, label: '↑', key: 'SPACE', color: 'rgba(164, 212, 180, 0.7)' },
            attack1: { x: positions.attack1X, y: positions.bottomY, width: buttonSize, height: buttonSize, label: 'D', key: 'D', color: 'rgba(90, 138, 112, 0.7)' },
            attack2: { x: positions.attack2X, y: positions.bottomY, width: buttonSize, height: buttonSize, label: 'E', key: 'E', color: 'rgba(90, 138, 112, 0.7)' }
        };
    }

    /**
     * Registers touch event listeners on canvas with passive false for preventDefault
     * @function registerTouchEvents
     * @returns {void}
     */
    registerTouchEvents() {
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.canvas.addEventListener('touchcancel', (e) => this.handleTouchEnd(e), { passive: false });
    }

    /**
     * Handles touch start events by processing all changed touches and activating buttons
     * @function handleTouchStart
     * @param {TouchEvent} e - Touch event object
     * @returns {void}
     */
    handleTouchStart(e) {
        e.preventDefault();

        const { scaleX, scaleY, rect } = this.getCanvasScaleFactors();

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            this.processTouchStart(touch, scaleX, scaleY, rect);
        }
    }

    /**
     * Processes individual touch start by checking button collision and activating if hit
     * @function processTouchStart
     * @param {Touch} touch - Individual touch object
     * @param {number} scaleX - Canvas scale factor X
     * @param {number} scaleY - Canvas scale factor Y
     * @param {DOMRect} rect - Canvas bounding rectangle
     * @returns {void}
     */
    processTouchStart(touch, scaleX, scaleY, rect) {
        const touchX = (touch.clientX - rect.left) * scaleX;
        const touchY = (touch.clientY - rect.top) * scaleY;

        for (let [name, button] of Object.entries(this.buttons)) {
            if (this.isTouchInButton(touchX, touchY, button)) {
                this.activateTouchButton(touch.identifier, name, button, touchX, touchY);
                break;
            }
        }
    }

    /**
     * Activates a touch button by setting keyboard state and tracking the touch
     * @function activateTouchButton
     * @param {number} touchId - Touch identifier
     * @param {string} buttonName - Name of the button
     * @param {Object} button - Button definition object
     * @param {number} touchX - Touch X coordinate
     * @param {number} touchY - Touch Y coordinate
     * @returns {void}
     */
    activateTouchButton(touchId, buttonName, button, touchX, touchY) {
        this.keyboard[button.key] = true;
        this.activeTouches[touchId] = buttonName;
    }

    /**
     * Handles touch end events by deactivating all ended touches and their corresponding buttons
     * @function handleTouchEnd
     * @param {TouchEvent} e - Touch event object
     * @returns {void}
     */
    handleTouchEnd(e) {
        e.preventDefault();

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const buttonName = this.activeTouches[touch.identifier];

            if (buttonName) {
                const button = this.buttons[buttonName];
                this.keyboard[button.key] = false;
                delete this.activeTouches[touch.identifier];
            }
        }
    }

    /**
     * Handles touch move events to detect when finger moves outside button area
     * @function handleTouchMove
     * @param {TouchEvent} e - Touch event object
     * @returns {void}
     */
    handleTouchMove(e) {
        e.preventDefault();

        const { scaleX, scaleY, rect } = this.getCanvasScaleFactors();

        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            this.checkTouchMovedOutsideButton(touch, scaleX, scaleY, rect);
        }
    }

    /**
     * Calculates canvas scale factors and bounding rectangle for touch coordinate conversion
     * @function getCanvasScaleFactors
     * @returns {Object} Object containing scaleX, scaleY and rect properties
     */
    getCanvasScaleFactors() {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return { scaleX, scaleY, rect };
    }

    /**
     * Checks if a touch has moved outside its button area and releases it if so
     * @function checkTouchMovedOutsideButton
     * @param {Touch} touch - Touch object to check
     * @param {number} scaleX - Canvas scale factor X
     * @param {number} scaleY - Canvas scale factor Y
     * @param {DOMRect} rect - Canvas bounding rectangle
     * @returns {void}
     */
    checkTouchMovedOutsideButton(touch, scaleX, scaleY, rect) {
        const buttonName = this.activeTouches[touch.identifier];

        if (buttonName) {
            const button = this.buttons[buttonName];
            const touchX = (touch.clientX - rect.left) * scaleX;
            const touchY = (touch.clientY - rect.top) * scaleY;

            if (!this.isTouchInButton(touchX, touchY, button)) {
                this.releaseTouchButton(touch.identifier, buttonName, button);
            }
        }
    }

    /**
     * Releases a touch button by deactivating keyboard state and removing from active touches
     * @function releaseTouchButton
     * @param {number} touchId - Touch identifier
     * @param {string} buttonName - Name of the button
     * @param {Object} button - Button definition object
     * @returns {void}
     */
    releaseTouchButton(touchId, buttonName, button) {
        this.keyboard[button.key] = false;
        delete this.activeTouches[touchId];
    }

    /**
     * Checks if touch coordinates are within a button's boundaries
     * @function isTouchInButton
     * @param {number} x - Touch X coordinate
     * @param {number} y - Touch Y coordinate
     * @param {Object} button - Button definition object with position and dimensions
     * @returns {boolean} True if touch is inside button, false otherwise
     */
    isTouchInButton(x, y, button) {
        return x >= button.x &&
               x <= button.x + button.width &&
               y >= button.y &&
               y <= button.y + button.height;
    }

    /**
     * Draws all touch control buttons on the canvas with active state highlighting
     * @function draw
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @returns {void}
     */
    draw(ctx) {
        for (let [name, button] of Object.entries(this.buttons)) {
            const isActive = this.keyboard[button.key];
            this.drawButton(ctx, button, isActive);
        }
    }

    /**
     * Draws a single button with background, border and label
     * @function drawButton
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Object} button - Button definition object
     * @param {boolean} isActive - Whether button is currently pressed
     * @returns {void}
     */
    drawButton(ctx, button, isActive) {
        this.drawButtonBackground(ctx, button, isActive);
        this.drawButtonBorder(ctx, button, isActive);
        this.drawButtonLabel(ctx, button, isActive);
    }

    /**
     * Draws button background with active state color change
     * @function drawButtonBackground
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Object} button - Button definition object
     * @param {boolean} isActive - Whether button is currently pressed
     * @returns {void}
     */
    drawButtonBackground(ctx, button, isActive) {
        ctx.fillStyle = isActive ? 'rgba(164, 212, 180, 0.9)' : button.color;
        ctx.fillRect(button.x, button.y, button.width, button.height);
    }

    /**
     * Draws button border with active state color change
     * @function drawButtonBorder
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Object} button - Button definition object
     * @param {boolean} isActive - Whether button is currently pressed
     * @returns {void}
     */
    drawButtonBorder(ctx, button, isActive) {
        ctx.strokeStyle = isActive ? '#a4d4b4' : '#3f6654';
        ctx.lineWidth = 3;
        ctx.strokeRect(button.x, button.y, button.width, button.height);
    }

    /**
     * Draws button label text with active state color change
     * @function drawButtonLabel
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Object} button - Button definition object
     * @param {boolean} isActive - Whether button is currently pressed
     * @returns {void}
     */
    drawButtonLabel(ctx, button, isActive) {
        ctx.fillStyle = isActive ? '#1a2f23' : '#a4d4b4';
        ctx.font = 'bold 24px PixelifySans';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(button.label, button.x + button.width / 2, button.y + button.height / 2);
    }

    /**
     * Cleans up touch controls by releasing active touches and removing event listeners
     * @function cleanup
     * @returns {void}
     */
    cleanup() {
        for (let [touchId, buttonName] of Object.entries(this.activeTouches)) {
            const button = this.buttons[buttonName];
            this.keyboard[button.key] = false;
        }
        this.activeTouches = {};

        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        this.canvas.removeEventListener('touchend', this.handleTouchEnd);
        this.canvas.removeEventListener('touchmove', this.handleTouchMove);
        this.canvas.removeEventListener('touchcancel', this.handleTouchEnd);
    }
}