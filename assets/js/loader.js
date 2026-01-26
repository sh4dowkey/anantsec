
(function() {
  'use strict';
  
  // Minimum display time (in ms) to prevent flash
  const MIN_LOADING_TIME = 800;
  const startTime = performance.now();
  
  // Animated dots for loading text
  function animateDots() {
    const dotsElement = document.querySelector('.loader-text .dots');
    if (!dotsElement) return;
    
    let dotCount = 0;
    const interval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      dotsElement.textContent = '.'.repeat(dotCount);
    }, 500);
    
    // Store interval ID to clear later
    window.loaderDotsInterval = interval;
  }
  
  // Hide loader with smooth animation
  function hideLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;
    
    // Clear dots animation
    if (window.loaderDotsInterval) {
      clearInterval(window.loaderDotsInterval);
    }
    
    // Calculate elapsed time
    const elapsedTime = performance.now() - startTime;
    const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
    
    // Wait for minimum time, then hide
    setTimeout(() => {
      loader.classList.add('loaded');
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 500);
      
      // Announce to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = 'Page loaded successfully';
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
      
    }, remainingTime);
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      animateDots();
      
      // Hide loader when page is fully loaded
      if (document.readyState === 'complete') {
        hideLoader();
      } else {
        window.addEventListener('load', hideLoader);
      }
    });
  } else {
    animateDots();
    
    // If already loaded
    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
    }
  }
  
  // Fallback timeout (if load event never fires)
  setTimeout(() => {
    console.warn('⚠️ Loader timeout - forcing removal');
    hideLoader();
  }, 10000);
  
  // Handle page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      const loader = document.getElementById('pageLoader');
      if (loader && document.readyState === 'complete') {
        hideLoader();
      }
    }
  });
})();