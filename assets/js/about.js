// assets/js/about-fullscreen.js

document.addEventListener('DOMContentLoaded', () => {
  initAboutPage();
});

function initAboutPage() {
  const loadingScreen = document.getElementById('loading-screen');
  const iframe = document.getElementById('badge-iframe');
  const helpOverlay = document.getElementById('help-overlay');
  const helpToggle = document.getElementById('help-toggle');
  const helpClose = document.querySelector('.help-close');
  const helpCta = document.querySelector('.help-cta');
  const quickCommands = document.querySelectorAll('.quick-cmd[data-cmd]');

  // Hide loading screen after iframe loads
  if (iframe) {
    iframe.addEventListener('load', () => {
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.classList.add('hidden');
        }
        
        // Show help overlay on first visit
        checkFirstVisit();
      }, 500);
    });

    // Fallback timeout
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
      }
    }, 5000);
  }

  // Check if first visit
  function checkFirstVisit() {
    const hasVisited = localStorage.getItem('about-visited');
    if (!hasVisited && helpOverlay) {
      setTimeout(() => {
        helpOverlay.classList.add('visible');
        announceToScreenReader('Welcome! Help guide is now visible.');
      }, 1000);
      localStorage.setItem('about-visited', 'true');
    }
  }

  // Help overlay controls
  if (helpToggle) {
    helpToggle.addEventListener('click', () => {
      if (helpOverlay) {
        helpOverlay.classList.add('visible');
        announceToScreenReader('Help guide opened');
      }
    });
  }

  if (helpClose) {
    helpClose.addEventListener('click', closeHelpOverlay);
  }

  if (helpCta) {
    helpCta.addEventListener('click', closeHelpOverlay);
  }

  if (helpOverlay) {
    helpOverlay.addEventListener('click', (e) => {
      if (e.target === helpOverlay) {
        closeHelpOverlay();
      }
    });
  }

  function closeHelpOverlay() {
    if (helpOverlay) {
      helpOverlay.classList.remove('visible');
      announceToScreenReader('Help guide closed');
    }
  }

  // Keyboard shortcut for help (?)
  document.addEventListener('keydown', (e) => {
    if (e.key === '?' && helpOverlay) {
      e.preventDefault();
      helpOverlay.classList.toggle('visible');
    }
    if (e.key === 'Escape' && helpOverlay?.classList.contains('visible')) {
      closeHelpOverlay();
    }
  });

  // Quick command buttons
  quickCommands.forEach(btn => {
    btn.addEventListener('click', () => {
      const command = btn.dataset.cmd;
      if (command && iframe?.contentWindow) {
        // Try to send command to iframe terminal
        sendCommandToIframe(command);
        
        // Visual feedback
        btn.style.transform = 'scale(0.9)';
        setTimeout(() => {
          btn.style.transform = '';
        }, 150);
      }
    });
  });

  function sendCommandToIframe(command) {
    try {
      // Post message to iframe
      iframe.contentWindow.postMessage({
        type: 'TERMINAL_COMMAND',
        command: command
      }, '*');
      
      console.log(`📤 Sent command to terminal: ${command}`);
      announceToScreenReader(`Executing command: ${command}`);
    } catch (error) {
      console.warn('Could not send command to iframe:', error);
    }
  }

  // Listen for messages from iframe
  window.addEventListener('message', (event) => {
    // Security check: only accept messages from trusted origins
    if (event.origin !== 'https://badge-anantsec.netlify.app' && 
        event.origin !== window.location.origin) {
      return;
    }

    if (event.data.type === 'TERMINAL_READY') {
      console.log('✅ Terminal is ready');
    }
  });

  // Responsive adjustments
  handleResponsive();
  window.addEventListener('resize', handleResponsive);

  function handleResponsive() {
    const quickCmdBar = document.querySelector('.quick-commands');
    if (!quickCmdBar) return;

    if (window.innerWidth < 480) {
      // Hide labels on very small screens
      quickCmdBar.style.padding = '8px 12px';
    } else {
      quickCmdBar.style.padding = '12px 20px';
    }
  }

  // Announce to screen readers
  function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }

  // Performance monitoring
  if (window.performance) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page load time: ${loadTime}ms`);
        
        if (loadTime > 5000) {
          console.warn('⚠️ Slow load detected. Consider optimizing.');
        }
      }, 0);
    });
  }

  console.log('✅ About page initialized');
}

// Enhanced iframe communication (for if you self-host the badge)
// This allows two-way communication between parent and iframe
class IframeBridge {
  constructor(iframeElement) {
    this.iframe = iframeElement;
    this.ready = false;
    this.messageQueue = [];
    
    this.init();
  }

  init() {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'IFRAME_READY') {
        this.ready = true;
        this.flushQueue();
        console.log('✅ Iframe bridge ready');
      }
    });
  }

  sendCommand(command) {
    const message = {
      type: 'TERMINAL_COMMAND',
      command: command,
      timestamp: Date.now()
    };

    if (this.ready) {
      this.postMessage(message);
    } else {
      this.messageQueue.push(message);
    }
  }

  postMessage(message) {
    if (this.iframe?.contentWindow) {
      this.iframe.contentWindow.postMessage(message, '*');
    }
  }

  flushQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.postMessage(message);
    }
  }
}

// Initialize bridge (optional - for enhanced features)
window.addEventListener('load', () => {
  const iframe = document.getElementById('badge-iframe');
  if (iframe) {
    window.iframeBridge = new IframeBridge(iframe);
  }
});