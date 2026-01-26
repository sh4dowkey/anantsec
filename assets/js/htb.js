
// Show loading skeleton
function showHTBLoading() {
  const wrapper = document.getElementById("htb-wrapper");
  if (!wrapper) return;
  
  wrapper.innerHTML = `
    <div class="skeleton-wrapper" role="status" aria-live="polite" aria-label="Loading HTB writeups">
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
    </div>
  `;
}

// Show error state
function showHTBError() {
  const wrapper = document.getElementById("htb-wrapper");
  if (!wrapper) return;
  
  wrapper.innerHTML = `
    <div class="error-state" role="alert">
      <i class="fas fa-exclamation-triangle"></i>
      <p>⚠️ Failed to load HTB writeups.</p>
      <button onclick="loadHTBWriteups()" class="retry-btn">
        <i class="fas fa-redo"></i> Try Again
      </button>
    </div>
  `;
}

// Render writeups
function renderHTBWriteups(data) {
  const wrapper = document.getElementById("htb-wrapper");
  if (!wrapper) return;
  
  wrapper.innerHTML = '';
  
  if (data.length === 0) {
    wrapper.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: #888;">
        <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
        <p>No writeups available yet. Check back soon!</p>
      </div>
    `;
    return;
  }
  
  data.forEach((post, index) => {
    const entry = document.createElement("div");
    entry.className = "writeup-entry";
    entry.style.animation = `fadeInUp 0.4s ease forwards ${index * 0.1}s`;
    entry.style.opacity = '0';
    
    const link = document.createElement("a");
    link.href = `../view.html?type=htb&file=${encodeURIComponent(post.file)}`;
    link.textContent = post.name;
    link.setAttribute('aria-label', `Read writeup: ${post.name}`);
    
    const date = document.createElement("span");
    date.className = "writeup-date";
    date.textContent = post.date;
    date.setAttribute('aria-label', `Published on ${post.date}`);
    
    entry.appendChild(link);
    entry.appendChild(date);
    wrapper.appendChild(entry);
  });
  
  // Announce to screen readers
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = `${data.length} HTB writeups loaded`;
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
}

// Load writeups
function loadHTBWriteups() {
  showHTBLoading();
  
  fetch("../data/htb.json")
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(data => {
      setTimeout(() => renderHTBWriteups(data), 300);
    })
    .catch(err => {
      console.error("❌ Error loading HTB writeups:", err);
      showHTBError();
    });
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadHTBWriteups);
} else {
  loadHTBWriteups();
}