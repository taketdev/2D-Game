// Mobile Fullscreen Functionality
document.addEventListener('DOMContentLoaded', function() {
    const fullscreenBtn = document.getElementById('fullscreen-button');
    const body = document.body;
    const canvasFrame = document.querySelector('.canvas-frame');
    
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', enterGameFullscreen);
        fullscreenBtn.addEventListener('touchstart', enterGameFullscreen);
    }
    
    // Add click listener to canvas frame overlay (for portrait mode)
    if (canvasFrame) {
        canvasFrame.addEventListener('click', enterGameFullscreen);
        canvasFrame.addEventListener('touchstart', enterGameFullscreen);
    }
    
    // Auto-detect orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(checkOrientation, 500);
    });
    
    window.addEventListener('resize', checkOrientation);
    
    // Initial check
    checkOrientation();
    
    function checkOrientation() {
        const isMobile = window.innerWidth <= 768;
        const isLandscape = window.innerWidth > window.innerHeight;
        
        if (document.fullscreenElement) {
            // In fullscreen mode - check orientation
            if (isMobile && !isLandscape) {
                body.classList.add('portrait-warning');
            } else {
                body.classList.remove('portrait-warning');
            }
        } else {
            // Not in fullscreen
            body.classList.remove('portrait-warning');
            
            if (isMobile && isLandscape && fullscreenBtn) {
                fullscreenBtn.style.display = 'block';
            } else if (fullscreenBtn) {
                fullscreenBtn.style.display = 'none';
            }
        }
    }
    
    function enterGameFullscreen(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const element = document.documentElement;
        
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
        
        // Add fullscreen class for styling
        body.classList.add('fullscreen-mode');
        
        // Check orientation after entering fullscreen
        setTimeout(checkOrientation, 100);
        
        // Hide address bar on mobile
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 200);
    }
    
    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        
        // Remove fullscreen class
        body.classList.remove('fullscreen-mode');
        body.classList.remove('portrait-warning');
    }
    
    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('mozfullscreenchange', onFullscreenChange);
    document.addEventListener('MSFullscreenChange', onFullscreenChange);
    
    // Listen for ESC key to exit fullscreen
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && document.fullscreenElement) {
            exitFullscreen();
        }
    });
    
    // Add double-tap to exit fullscreen on canvas
    let lastTap = 0;
    document.addEventListener('touchend', function(event) {
        if (document.fullscreenElement && event.target.tagName === 'CANVAS') {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                // Double tap detected
                exitFullscreen();
                event.preventDefault();
            }
            lastTap = currentTime;
        }
    });
    
    function onFullscreenChange() {
        if (!document.fullscreenElement && 
            !document.webkitFullscreenElement && 
            !document.mozFullScreenElement && 
            !document.msFullscreenElement) {
            
            // Exited fullscreen
            body.classList.remove('fullscreen-mode');
            body.classList.remove('portrait-warning');
            checkOrientation();
        }
    }
});

// CSS Animation for pulsing button
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { 
            transform: scale(1);
            box-shadow: inset 2px 2px 0 #3f6654, inset -2px -2px 0 #0f1912, 3px 3px 0 #000;
        }
        50% { 
            transform: scale(1.05);
            box-shadow: inset 2px 2px 0 #5a8a70, inset -2px -2px 0 #1a2f23, 4px 4px 0 #000;
        }
        100% { 
            transform: scale(1);
            box-shadow: inset 2px 2px 0 #3f6654, inset -2px -2px 0 #0f1912, 3px 3px 0 #000;
        }
    }
`;
document.head.appendChild(style);