/**
 * Orientation Management for Mobile
 * Simple Portrait/Landscape detection - NO FULLSCREEN
 */

document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;

    /**
     * Checks device orientation and handles portrait/landscape mode accordingly
     * @function checkOrientation
     * @returns {void}
     */
    function checkOrientation() {
        const isMobile = isMobileDevice();
        const isLandscape = window.innerWidth > window.innerHeight;

        if (isMobile && !isLandscape) {
            handlePortraitMode();
        } else {
            handleLandscapeMode();
        }
    }

    /**
     * Handles portrait mode by adding warning class and pausing game if active
     * @function handlePortraitMode
     * @returns {void}
     */
    function handlePortraitMode() {
        body.classList.add('portrait-warning');
        if (typeof world !== 'undefined' && world && !world.isPaused) {
            pauseGameForPortrait();
        }
    }

    /**
     * Pauses the game and music when device is in portrait mode
     * @function pauseGameForPortrait
     * @returns {void}
     */
    function pauseGameForPortrait() {
        world.isPaused = true;
        if (typeof audioManager !== 'undefined' && audioManager) {
            audioManager.pauseMusic();
        }
        console.log('Game paused: Portrait mode - please rotate device');
    }

    /**
     * Handles landscape mode by removing warning class and resuming game if paused
     * @function handleLandscapeMode
     * @returns {void}
     */
    function handleLandscapeMode() {
        body.classList.remove('portrait-warning');
        if (typeof world !== 'undefined' && world && world.isPaused && !menu.isActive) {
            resumeGameForLandscape();
        }
    }

    /**
     * Resumes the game and music when device returns to landscape mode
     * @function resumeGameForLandscape
     * @returns {void}
     */
    function resumeGameForLandscape() {
        world.isPaused = false;
        if (typeof audioManager !== 'undefined' && audioManager) {
            audioManager.resumeMusic();
        }
        console.log('Game resumed: Landscape mode');
    }

    window.addEventListener('orientationchange', function() {
        setTimeout(checkOrientation, 300);
    });

    window.addEventListener('resize', function() {
        setTimeout(checkOrientation, 100);
    });

    setTimeout(checkOrientation, 100);

    console.log('Orientation management initialized - NO FULLSCREEN');
});
