
// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Sanitize HTML input
export function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Error boundary handler
export class ErrorBoundary {
  constructor(element, fallbackHTML) {
    this.element = element;
    this.fallbackHTML = fallbackHTML;
  }
  
  async tryRender(renderFn) {
    try {
      await renderFn();
    } catch (error) {
      console.error('❌ Render error:', error);
      this.element.innerHTML = this.fallbackHTML;
      this.logError(error);
    }
  }
  
  logError(error) {
    // Send to analytics if configured
    if (window.gtag) {
      gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }
  }
}

// Loading state manager
export function showLoadingSkeleton(containerId, count = 3) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = `
    <div class="skeleton-wrapper" role="status" aria-live="polite" aria-label="Loading content">
      ${Array(count).fill('<div class="skeleton-item"></div>').join('')}
    </div>
  `;
}

export function hideLoadingSkeleton(containerId) {
  const skeleton = document.querySelector(`#${containerId} .skeleton-wrapper`);
  if (skeleton) skeleton.remove();
}

// Show error state
export function showErrorState(containerId, message) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = `
    <div class="error-state" role="alert">
      <i class="fas fa-exclamation-triangle"></i>
      <p>${message}</p>
      <button onclick="location.reload()" class="retry-btn">
        <i class="fas fa-redo"></i> Try Again
      </button>
    </div>
  `;
}

// Focus trap for modals
export function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };
  
  element.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => element.removeEventListener('keydown', handleKeyDown);
}

// Reading progress indicator
export function initReadingProgress() {
  const progressBar = document.querySelector('.reading-progress-fill');
  if (!progressBar) return;
  
  const updateProgress = throttle(() => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    progressBar.style.width = scrolled + '%';
    progressBar.parentElement.setAttribute('aria-valuenow', Math.round(scrolled));
  }, 100);
  
  window.addEventListener('scroll', updateProgress);
  return () => window.removeEventListener('scroll', updateProgress);
}

// Performance monitoring
export function logPerformanceMetrics() {
  if (!('performance' in window)) return;
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;
      
      console.log('⚡ Performance Metrics:');
      console.log(`├─ Page Load: ${pageLoadTime}ms`);
      console.log(`├─ Server Response: ${connectTime}ms`);
      console.log(`└─ DOM Render: ${renderTime}ms`);
      
      if (pageLoadTime > 3000) {
        console.warn('⚠️ Page load time exceeds 3 seconds');
      }
    }, 0);
  });
}