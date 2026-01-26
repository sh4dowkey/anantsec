// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get('type');
const file = urlParams.get('file');

const contentDiv = document.getElementById('content');

// Show loading state
function showLoading() {
  if (!contentDiv) return;
  contentDiv.innerHTML = `
    <div class="loading-state" role="status" aria-live="polite">
      <div class="loading-spinner"></div>
      <p>Loading writeup...</p>
    </div>
  `;
}

// Show error state
function showError(message) {
  if (!contentDiv) return;
  contentDiv.innerHTML = `
    <div class="error-state" role="alert">
      <i class="fas fa-exclamation-triangle"></i>
      <p>${message}</p>
      <button onclick="location.reload()" class="retry-btn">
        <i class="fas fa-redo"></i> Try Again
      </button>
    </div>
  `;
}

// Sanitize HTML content
function sanitizeHTML(html) {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
}

// Load writeup content
async function loadWriteup() {
  // Validate parameters
  if (!type || !file) {
    showError('❌ Invalid file path. Please check the URL.');
    return;
  }
  
  showLoading();
  
  try {
    const response = await fetch(`./posts/${type}/${file}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Small delay for smooth transition
    setTimeout(() => {
      contentDiv.innerHTML = html;
      
      // Initialize reading progress
      initReadingProgress();
      
      // Announce to screen readers
      announceToScreenReader('Writeup loaded successfully');
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
    
  } catch (error) {
    console.error('❌ Error loading writeup:', error);
    
    if (error.message.includes('404')) {
      showError('⚠️ Writeup not found. It may have been moved or deleted.');
    } else {
      showError('⚠️ Failed to load the writeup. Please try again later.');
    }
  }
}

// Initialize reading progress indicator
function initReadingProgress() {
  const progressBar = document.querySelector('.reading-progress-fill');
  if (!progressBar) return;
  
  let ticking = false;
  
  function updateProgress() {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = Math.min((winScroll / height) * 100, 100);
    
    progressBar.style.width = scrolled + '%';
    progressBar.parentElement.setAttribute('aria-valuenow', Math.round(scrolled));
    
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick);
  updateProgress(); // Initial update
}

// Enhanced back button with history support
function goBack(e) {
  e.preventDefault();
  
  // Check if there's history
  if (window.history.length > 1 && document.referrer) {
    window.history.back();
  } else {
    // Fallback to writeups page
    const fallbackUrl = type === 'htb' ? 'blog/htb.html' : 
                        type === 'bugbounty' ? 'blog/bugbounty.html' : 
                        'writeups.html';
    window.location.href = fallbackUrl;
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

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadWriteup);
} else {
  loadWriteup();
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Escape key to go back
  if (e.key === 'Escape') {
    const backButton = document.querySelector('.back-button');
    if (backButton) {
      backButton.click();
    }
  }
});