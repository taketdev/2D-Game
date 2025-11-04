/**
 * Touch Controls for Mobile/Tablet
 * Handles all touch input for game controls
 */

// Mobile Detection
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || window.innerWidth <= 768;
}

// Global instance (will be initialized when game starts)
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

        // Active touch tracking
        this.activeTouches = {};

        // Button definitions
        this.buttons = this.defineButtons();

        // Register touch event listeners
        this.registerTouchEvents();

        console.log('Touch Controls initialized');
    }

    /**
     * Define all touch button positions and properties
     */
    defineButtons() {
        const sizes = this.getButtonSizes();
        const positions = this.calculateButtonPositions(sizes);
        return this.createButtonDefinitions(sizes, positions);
    }

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
     * Register touch event listeners on canvas
     */
    registerTouchEvents() {
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.canvas.addEventListener('touchcancel', (e) => this.handleTouchEnd(e), { passive: false });
    }

    /**
     * Handle touch start event
     */
    handleTouchStart(e) {
        e.preventDefault();

        const { scaleX, scaleY, rect } = this.getCanvasScaleFactors();

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            this.processTouchStart(touch, scaleX, scaleY, rect);
        }
    }

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

    activateTouchButton(touchId, buttonName, button, touchX, touchY) {
        this.keyboard[button.key] = true;
        this.activeTouches[touchId] = buttonName;
        console.log(`Touch start: ${buttonName} (${button.key}) at ${touchX.toFixed(0)},${touchY.toFixed(0)}`);
    }

    /**
     * Handle touch end event
     */
    handleTouchEnd(e) {
        e.preventDefault();

        // Process all ended touches
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const buttonName = this.activeTouches[touch.identifier];

            if (buttonName) {
                const button = this.buttons[buttonName];
                // Deactivate keyboard key
                this.keyboard[button.key] = false;
                delete this.activeTouches[touch.identifier];
                console.log(`Touch end: ${buttonName} (${button.key})`);
            }
        }
    }

    /**
     * Handle touch move event (for detecting when finger leaves button)
     */
    handleTouchMove(e) {
        e.preventDefault();

        const { scaleX, scaleY, rect } = this.getCanvasScaleFactors();

        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            this.checkTouchMovedOutsideButton(touch, scaleX, scaleY, rect);
        }
    }

    getCanvasScaleFactors() {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return { scaleX, scaleY, rect };
    }

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

    releaseTouchButton(touchId, buttonName, button) {
        this.keyboard[button.key] = false;
        delete this.activeTouches[touchId];
        console.log(`Touch moved out: ${buttonName} (${button.key})`);
    }

    /**
     * Check if touch coordinates are inside a button
     */
    isTouchInButton(x, y, button) {
        return x >= button.x &&
               x <= button.x + button.width &&
               y >= button.y &&
               y <= button.y + button.height;
    }

    /**
     * Draw all touch control buttons on canvas
     */
    draw(ctx) {
        for (let [name, button] of Object.entries(this.buttons)) {
            const isActive = this.keyboard[button.key];
            this.drawButton(ctx, button, isActive);
        }
    }

    drawButton(ctx, button, isActive) {
        this.drawButtonBackground(ctx, button, isActive);
        this.drawButtonBorder(ctx, button, isActive);
        this.drawButtonLabel(ctx, button, isActive);
    }

    drawButtonBackground(ctx, button, isActive) {
        ctx.fillStyle = isActive ? 'rgba(164, 212, 180, 0.9)' : button.color;
        ctx.fillRect(button.x, button.y, button.width, button.height);
    }

    drawButtonBorder(ctx, button, isActive) {
        ctx.strokeStyle = isActive ? '#a4d4b4' : '#3f6654';
        ctx.lineWidth = 3;
        ctx.strokeRect(button.x, button.y, button.width, button.height);
    }

    drawButtonLabel(ctx, button, isActive) {
        ctx.fillStyle = isActive ? '#1a2f23' : '#a4d4b4';
        ctx.font = 'bold 24px PixelifySans';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(button.label, button.x + button.width / 2, button.y + button.height / 2);
    }

    /**
     * Cleanup touch controls
     */
    cleanup() {
        // Release all active touches
        for (let [touchId, buttonName] of Object.entries(this.activeTouches)) {
            const button = this.buttons[buttonName];
            this.keyboard[button.key] = false;
        }
        this.activeTouches = {};

        // Remove event listeners
        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        this.canvas.removeEventListener('touchend', this.handleTouchEnd);
        this.canvas.removeEventListener('touchmove', this.handleTouchMove);
        this.canvas.removeEventListener('touchcancel', this.handleTouchEnd);
    }
}
