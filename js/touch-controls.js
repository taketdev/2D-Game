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
        const buttonSize = 60;
        const smallButtonSize = 50;
        const padding = 15;
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;

        return {
            // Left side - Movement controls
            left: {
                x: padding,
                y: canvasHeight - buttonSize - padding,
                width: buttonSize,
                height: buttonSize,
                label: '←',
                key: 'LEFT',
                color: 'rgba(45, 74, 62, 0.7)'
            },
            right: {
                x: padding + buttonSize + 10,
                y: canvasHeight - buttonSize - padding,
                width: buttonSize,
                height: buttonSize,
                label: '→',
                key: 'RIGHT',
                color: 'rgba(45, 74, 62, 0.7)'
            },
            shift: {
                x: padding + (buttonSize / 2) + 5,
                y: canvasHeight - buttonSize * 2 - padding - 10,
                width: smallButtonSize,
                height: smallButtonSize,
                label: '⚡',
                key: 'SHIFT',
                color: 'rgba(90, 138, 112, 0.7)'
            },

            // Right side - Action controls
            jump: {
                x: canvasWidth - buttonSize - padding,
                y: canvasHeight - buttonSize - padding,
                width: buttonSize,
                height: buttonSize,
                label: '↑',
                key: 'SPACE',
                color: 'rgba(164, 212, 180, 0.7)'
            },
            attack1: {
                x: canvasWidth - buttonSize * 2 - padding - 10,
                y: canvasHeight - buttonSize - padding,
                width: buttonSize,
                height: buttonSize,
                label: 'D',
                key: 'D',
                color: 'rgba(90, 138, 112, 0.7)'
            },
            attack2: {
                x: canvasWidth - buttonSize * 3 - padding - 20,
                y: canvasHeight - buttonSize - padding,
                width: buttonSize,
                height: buttonSize,
                label: 'E',
                key: 'E',
                color: 'rgba(90, 138, 112, 0.7)'
            }
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

        const rect = this.canvas.getBoundingClientRect();

        // Calculate scale factors (canvas logical size vs displayed size)
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        // Process all touch points
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            // Convert from displayed coordinates to canvas coordinates
            const touchX = (touch.clientX - rect.left) * scaleX;
            const touchY = (touch.clientY - rect.top) * scaleY;

            // Check which button was touched
            for (let [name, button] of Object.entries(this.buttons)) {
                if (this.isTouchInButton(touchX, touchY, button)) {
                    // Activate keyboard key
                    this.keyboard[button.key] = true;
                    this.activeTouches[touch.identifier] = name;
                    console.log(`Touch start: ${name} (${button.key}) at ${touchX.toFixed(0)},${touchY.toFixed(0)}`);
                    break;
                }
            }
        }
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

        const rect = this.canvas.getBoundingClientRect();

        // Calculate scale factors (canvas logical size vs displayed size)
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        // Check if active touches moved outside their buttons
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            const buttonName = this.activeTouches[touch.identifier];

            if (buttonName) {
                const button = this.buttons[buttonName];
                // Convert from displayed coordinates to canvas coordinates
                const touchX = (touch.clientX - rect.left) * scaleX;
                const touchY = (touch.clientY - rect.top) * scaleY;

                // If touch moved outside button, release it
                if (!this.isTouchInButton(touchX, touchY, button)) {
                    this.keyboard[button.key] = false;
                    delete this.activeTouches[touch.identifier];
                    console.log(`Touch moved out: ${buttonName} (${button.key})`);
                }
            }
        }
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

            // Button background
            ctx.fillStyle = isActive ? 'rgba(164, 212, 180, 0.9)' : button.color;
            ctx.fillRect(button.x, button.y, button.width, button.height);

            // Button border
            ctx.strokeStyle = isActive ? '#a4d4b4' : '#3f6654';
            ctx.lineWidth = 3;
            ctx.strokeRect(button.x, button.y, button.width, button.height);

            // Button label
            ctx.fillStyle = isActive ? '#1a2f23' : '#a4d4b4';
            ctx.font = 'bold 24px PixelifySans';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                button.label,
                button.x + button.width / 2,
                button.y + button.height / 2
            );
        }
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
