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
            // Mobile in portrait - show rotation message and pause game
            body.classList.add('portrait-warning');
            if (typeof world !== 'undefined' && world && !world.isPaused) {
                world.isPaused = true;
                console.log('Game paused: Portrait mode - please rotate device');
            }
        } else {
            // Landscape or desktop - remove warning and resume game
            body.classList.remove('portrait-warning');
            if (typeof world !== 'undefined' && world && world.isPaused && !menu.isActive) {
                world.isPaused = false;
                console.log('Game resumed: Landscape mode');
            }
        }
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
