
function showBugBountyLoading() {
  const wrapper = document.getElementById("bugbounty-wrapper");
  if (!wrapper) return;
  
  wrapper.innerHTML = `
    <div class="skeleton-wrapper" role="status" aria-live="polite" aria-label="Loading bug bounty writeups">
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
    </div>
  `;
}

function showBugBountyError() {
  const wrapper = document.getElementById("bugbounty-wrapper");
  if (!wrapper) return;
  
  wrapper.innerHTML = `
    <div class="error-state" role="alert">
      <i class="fas fa-exclamation-triangle"></i>
      <p>⚠️ Failed to load bug bounty writeups.</p>
      <button onclick="loadBugBountyWriteups()" class="retry-btn">
        <i class="fas fa-redo"></i> Try Again
      </button>
    </div>
  `;
}

function renderBugBountyWriteups(data) {
  const wrapper = document.getElementById("bugbounty-wrapper");
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
    link.href = `../view.html?type=bugbounty&file=${encodeURIComponent(post.file)}`;
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
  
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = `${data.length} bug bounty writeups loaded`;
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
}

function loadBugBountyWriteups() {
  showBugBountyLoading();
  
  fetch("../data/bugbounty.json")
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(data => {
      setTimeout(() => renderBugBountyWriteups(data), 300);
    })
    .catch(err => {
      console.error("❌ Error loading bug bounty writeups:", err);
      showBugBountyError();
    });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadBugBountyWriteups);
} else {
  loadBugBountyWriteups();
}