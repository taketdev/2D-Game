/**
 * Orientation Management for Mobile
 * Simple Portrait/Landscape detection - NO FULLSCREEN
 */

document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;

    // Check orientation - simple portrait/landscape detection
    function checkOrientation() {
        const isMobile = isMobileDevice();
        const isLandscape = window.innerWidth > window.innerHeight;

        if (isMobile && !isLandscape) {
            handlePortraitMode();
        } else {
            handleLandscapeMode();
        }
    }

    function handlePortraitMode() {
        body.classList.add('portrait-warning');
        if (typeof world !== 'undefined' && world && !world.isPaused) {
            pauseGameForPortrait();
        }
    }

    function pauseGameForPortrait() {
        world.isPaused = true;
        if (typeof audioManager !== 'undefined' && audioManager) {
            audioManager.pauseMusic();
        }
        console.log('Game paused: Portrait mode - please rotate device');
    }

    function handleLandscapeMode() {
        body.classList.remove('portrait-warning');
        if (typeof world !== 'undefined' && world && world.isPaused && !menu.isActive) {
            resumeGameForLandscape();
        }
    }

    function resumeGameForLandscape() {
        world.isPaused = false;
        if (typeof audioManager !== 'undefined' && audioManager) {
            audioManager.resumeMusic();
        }
        console.log('Game resumed: Landscape mode');
    }

    // Listen for orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(checkOrientation, 300);
    });

    window.addEventListener('resize', function() {
        setTimeout(checkOrientation, 100);
    });

    // Initial check
    setTimeout(checkOrientation, 100);

    console.log('Orientation management initialized - NO FULLSCREEN');
});
