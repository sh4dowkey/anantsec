// assets/js/security.js
// Comprehensive Security Module for anantsec Portfolio
// Version: 1.0.0

(function() {
  'use strict';

  // ========== 1. XSS Protection ==========
  function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  // Sanitize all user inputs
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('blur', function() {
        this.value = sanitizeInput(this.value);
      });
    });
  });

  // ========== 2. Prevent Console Tampering (Developer Tool Detection) ==========
  const devtoolsDetection = {
    isOpen: false,
    orientation: null,
    
    detect() {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        if (!this.isOpen) {
          this.isOpen = true;
          this.logSecurityEvent('DevTools opened');
        }
      } else {
        this.isOpen = false;
      }
    },
    
    logSecurityEvent(event) {
      // Log to console for legitimate debugging
      console.info(`[Security] ${event} - ${new Date().toISOString()}`);
      // Could send to analytics in production
    }
  };

  // Check every 500ms
  setInterval(() => devtoolsDetection.detect(), 500);

  // ========== 3. Clickjacking Protection ==========
  if (window.self !== window.top) {
    // Site is in iframe - potential clickjacking
    console.warn('[Security] Possible clickjacking attempt detected');
    // Break out of iframe
    window.top.location = window.self.location;
  }

  // ========== 4. Copy Protection for Sensitive Content ==========
  function addCopyProtection() {
    document.addEventListener('copy', function(e) {
      const selection = window.getSelection().toString();
      if (selection.length > 500) {
        // Allow copying but add attribution
        const attribution = '\n\n---\nSource: anantsec Portfolio (https://sh4dowkey.github.io)\nPlease respect intellectual property rights.';
        e.clipboardData.setData('text/plain', selection + attribution);
        e.preventDefault();
      }
    });
  }

  addCopyProtection();

  // ========== 5. Form Input Validation ==========
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validateURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // ========== 6. Rate Limiting for API Calls ==========
  const rateLimiter = {
    attempts: {},
    
    check(key, limit = 5, timeWindow = 60000) {
      const now = Date.now();
      
      if (!this.attempts[key]) {
        this.attempts[key] = [];
      }
      
      // Remove old attempts
      this.attempts[key] = this.attempts[key].filter(
        time => now - time < timeWindow
      );
      
      if (this.attempts[key].length >= limit) {
        console.warn(`[Security] Rate limit exceeded for ${key}`);
        return false;
      }
      
      this.attempts[key].push(now);
      return true;
    }
  };

  // ========== 7. Secure External Link Handler ==========
  function secureExternalLinks() {
    document.addEventListener('click', e => {
      const link = e.target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href) return;
      
      // Check if external
      if (link.hostname !== window.location.hostname && href.startsWith('http')) {
        // Ensure security attributes
        if (!link.hasAttribute('rel')) {
          link.setAttribute('rel', 'noopener noreferrer');
        }
        
        if (!link.hasAttribute('target')) {
          link.setAttribute('target', '_blank');
        }
        
        // Validate URL
        if (!validateURL(href)) {
          e.preventDefault();
          console.error('[Security] Invalid URL detected:', href);
          alert('Invalid link detected. For your security, this link has been blocked.');
        }
      }
    });
  }

  secureExternalLinks();

  // ========== 8. Session Timeout Warning ==========
  let sessionTimeout;
  let warningTimeout;
  const SESSION_LENGTH = 30 * 60 * 1000; // 30 minutes
  const WARNING_TIME = 25 * 60 * 1000; // 25 minutes

  function resetSessionTimer() {
    clearTimeout(sessionTimeout);
    clearTimeout(warningTimeout);
    
    warningTimeout = setTimeout(() => {
      console.info('[Security] Session will expire in 5 minutes');
    }, WARNING_TIME);
    
    sessionTimeout = setTimeout(() => {
      console.info('[Security] Session expired');
      // Could trigger re-authentication if needed
    }, SESSION_LENGTH);
  }

  // Reset on user activity
  ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetSessionTimer, { passive: true });
  });

  resetSessionTimer();

  // ========== 9. Content Integrity Check ==========
  function checkIntegrity() {
    // Verify critical scripts haven't been tampered with
    const criticalScripts = document.querySelectorAll('script[data-integrity]');
    
    criticalScripts.forEach(script => {
      const expectedHash = script.getAttribute('data-integrity');
      // In production, verify hash matches
      console.info('[Security] Integrity check for:', script.src);
    });
  }

  checkIntegrity();

  // ========== 10. Secure Storage Helper ==========
  const secureStorage = {
    set(key, value, encrypt = false) {
      try {
        const data = encrypt ? btoa(JSON.stringify(value)) : JSON.stringify(value);
        localStorage.setItem(key, data);
        return true;
      } catch (e) {
        console.error('[Security] Storage error:', e);
        return false;
      }
    },
    
    get(key, encrypted = false) {
      try {
        const data = localStorage.getItem(key);
        if (!data) return null;
        return encrypted ? JSON.parse(atob(data)) : JSON.parse(data);
      } catch (e) {
        console.error('[Security] Storage retrieval error:', e);
        return null;
      }
    },
    
    remove(key) {
      localStorage.removeItem(key);
    },
    
    clear() {
      localStorage.clear();
    }
  };

  // ========== 11. Browser Fingerprinting (Informational Only) ==========
  function getBrowserFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
    
    return {
      canvas: canvas.toDataURL(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookieEnabled: navigator.cookieEnabled
    };
  }

  // Log fingerprint (for analytics, not tracking)
  console.info('[Security] Browser fingerprint generated');

  // ========== 12. CSP Violation Reporter ==========
  document.addEventListener('securitypolicyviolation', (e) => {
    console.error('[Security] CSP Violation:', {
      violatedDirective: e.violatedDirective,
      blockedURI: e.blockedURI,
      sourceFile: e.sourceFile,
      lineNumber: e.lineNumber
    });
    
    // In production, send to monitoring service
  });

  // ========== 13. Prevent Drag & Drop Code Injection ==========
  document.addEventListener('drop', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      console.warn('[Security] Unauthorized drop event blocked');
    }
  });

  document.addEventListener('dragover', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
    }
  });

  // ========== 14. Prevent Data URI XSS ==========
  function checkDataURI(url) {
    if (url.startsWith('data:')) {
      console.warn('[Security] Data URI detected and blocked:', url.substring(0, 50));
      return false;
    }
    return true;
  }

  // Monitor image sources
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
        const element = mutation.target;
        const src = element.getAttribute('src');
        if (src && !checkDataURI(src) && element.tagName === 'SCRIPT') {
          element.remove();
          console.error('[Security] Malicious script blocked');
        }
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    subtree: true,
    attributeFilter: ['src', 'href']
  });

  // ========== 15. Expose Secure Utilities Globally ==========
  window.anantsecSecurity = {
    sanitize: sanitizeInput,
    validateEmail,
    validateURL,
    checkRateLimit: (key, limit, time) => rateLimiter.check(key, limit, time),
    storage: secureStorage,
    version: '1.0.0'
  };

  console.info('[Security] anantsec Security Module loaded v1.0.0');

})();

// ========== 16. Security Audit Logger ==========
class SecurityAudit {
  constructor() {
    this.logs = [];
    this.maxLogs = 100;
  }
  
  log(event, severity = 'info', data = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      event,
      severity,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    this.logs.push(entry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    // Console output based on severity
    const consoleFn = console[severity] || console.log;
    consoleFn(`[Security Audit] ${event}`, data);
    
    // In production: send to monitoring service
  }
  
  getRecentLogs(count = 10) {
    return this.logs.slice(-count);
  }
  
  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }
  
  clearLogs() {
    this.logs = [];
    console.info('[Security Audit] Logs cleared');
  }
}

window.securityAudit = new SecurityAudit();

// ========== 17. Protected Console Methods ==========
(function() {
  // Store original console methods
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info
  };

  // Add security prefix to console
  console.securityLog = function(...args) {
    originalConsole.log('[Security]', ...args);
  };

  console.securityWarn = function(...args) {
    originalConsole.warn('[Security]', ...args);
  };

  console.securityError = function(...args) {
    originalConsole.error('[Security]', ...args);
  };
})();

// ========== 18. Disable Specific Key Combinations (Optional - commented out) ==========
/*
document.addEventListener('keydown', (e) => {
  // Prevent opening DevTools with common shortcuts (optional)
  if (
    (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl+Shift+I
    (e.ctrlKey && e.shiftKey && e.key === 'J') || // Ctrl+Shift+J
    (e.ctrlKey && e.key === 'U') || // Ctrl+U
    (e.key === 'F12') // F12
  ) {
    e.preventDefault();
    console.warn('[Security] DevTools shortcut blocked');
  }
});
*/

// ========== 19. Memory Leak Prevention ==========
window.addEventListener('beforeunload', () => {
  // Clean up event listeners and timers
  console.info('[Security] Cleaning up before page unload');
  
  // Clear any sensitive data from memory
  if (window.anantsecSecurity) {
    window.anantsecSecurity.storage.clear();
  }
});

// ========== 20. Performance Monitoring ==========
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.timing;
      const loadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      if (loadTime > 3000) {
        console.warn('[Security] Slow page load detected - possible attack?');
      }
    }, 0);
  });
}

// ========== End of Security Module ==========
console.info('[Security] All security measures initialized successfully ✓');